"use client";

import { useMemo, useState, useEffect } from "react";
import CardComponent from "@/ui/card-wrapper";
import TabComponent from "@/ui/tab-component";
import { usePersistState } from "@/hooks/usePersistState";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import { ProjectResultResponse } from "@/types/project-result-dashboard";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import { fetchResultTypes, ResultType, transformResultTypesToOptions } from "@/lib/api/result-types";
import ViewIndicators from "../team-member-components/view-indicators";
import TableWithAccordion from "@/ui/table-with-accordion";
import ActionMenu from "@/ui/action-menu";
import GenericDeleteModal from "@/ui/generic-delete-modal";
import { indicatorApi } from "@/lib/api/indicatorApi";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Raw indicator object returned by the API */
type RawIndicator = {
  indicatorId: string;
  statement: string;
  cumulativeValue: number | null;  // baseline
  cumulativeTarget: number | null; // target
  baselineNarrative: string;
  targetNarrative: string;
  actual: number | null;
  performance: number | null;
  status: string;
  [key: string]: any;
};

/** The result (output / outcome / impact) an indicator belongs to */
type ResultChild = {
  id: string;
  statement: string;
  thematicArea: string;
  responsiblePerson: string;
  [key: string]: any;
};

/**
 * Table parent row = one Result (output / outcome / impact).
 * `childIndicators` holds the indicators belonging to it.
 */
type ResultRow = ResultChild & {
  id: string;
  childIndicators: RawIndicator[];
};

/** Intermediate shape used while fetching: result with its indicators */
type ResultWithIndicators = {
  id: string;
  statement: string;
  thematicArea: string;
  responsiblePerson: string;
  indicators: RawIndicator[];
  [key: string]: any;
};


/** Map a result type name to the correct API path segment */
function getResultEndpointSegment(resultName: string): string {
  const name = resultName.toLowerCase();
  if (name.includes("output")) return "outputs";
  if (name.includes("outcome")) return "outcomes";
  if (name.includes("impact")) return "impacts";
  return "";
}

/** Get the ID field name for each result type */
function getResultIdKey(resultName: string): string {
  const name = resultName.toLowerCase();
  if (name.includes("output")) return "outputId";
  if (name.includes("outcome")) return "outcomeId";
  if (name.includes("impact")) return "impactId";
  return "id";
}

/** Get the statement field name for each result type */
function getResultStatementKey(resultName: string): string {
  const name = resultName.toLowerCase();
  if (name.includes("output")) return "outputStatement";
  if (name.includes("outcome")) return "outcomeStatement";
  if (name.includes("impact")) return "statement";
  return "statement";
}


export default function ProjectKpiChartsTableParent({
  data,
  projectId,
}: {
  data: ProjectResultResponse;
  projectId: string;
}) {
  const [filters, setFilters] = usePersistState(`project-${projectId}-filters`, {
    allThematicArea: "",
    resultLevel: "",
    disaggregation: "",
  });

  const { allThematicArea, resultLevel, disaggregation } = filters;

  // Row-level action menu state for indicator children
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [indicatorToDelete, setIndicatorToDelete] = useState<RawIndicator | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Result types (for dropdown)
  const [resultTypes, setResultTypes] = useState<ResultType[]>([]);

  useEffect(() => {
    fetchResultTypes()
      .then(setResultTypes)
      .catch((e) => console.error("Failed to fetch result types", e));
  }, []);

  const resultTypeOptions = useMemo(
    () => transformResultTypesToOptions(resultTypes),
    [resultTypes]
  );

  // Pre-select the first result type option once options are loaded
  useEffect(() => {
    if (resultTypeOptions.length > 0 && !resultLevel) {
      setField("resultLevel", resultTypeOptions[0].value);
    }
  }, [resultTypeOptions]);

  // Fetched results — each carries its indicators[]
  const [resultRows, setResultRows] = useState<ResultWithIndicators[]>([]);
  const [loadingRows, setLoadingRows] = useState(false);
  // Bump to trigger a refetch (e.g., after deleting an indicator)
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!resultLevel || !projectId) {
      setResultRows([]);
      return;
    }

    const selectedType = resultTypes.find((t) => t.resultTypeId === resultLevel);
    if (!selectedType) return;

    const segment = getResultEndpointSegment(selectedType.resultName);
    const idKey = getResultIdKey(selectedType.resultName);
    const stmtKey = getResultStatementKey(selectedType.resultName);

    const fetchResultRows = async () => {
      setLoadingRows(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/${segment}/project/${projectId}`
        );
        const rows: any[] = res.data?.data || [];

        // For each result row, fetch its indicators
        const withIndicators: ResultWithIndicators[] = await Promise.all(
          rows.map(async (row) => {
            const resultId = row[idKey];
            let indicators: RawIndicator[] = [];
            try {
              const indRes = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicators/${resultId}`
              );
              // Tag each indicator with its parent result's entity ID so downstream
              // links (e.g. Report Actual) can pass it without re-deriving.
              indicators = (indRes.data?.data || []).map((ind: RawIndicator) => ({
                ...ind,
                resultId,
              }));
            } catch {
              // leave indicators empty on fetch failure
            }
            return {
              ...row,
              id: resultId,
              statement: row[stmtKey] ?? "-",
              thematicArea: row.thematicAreas ?? row.thematicArea ?? "-",
              responsiblePerson: row.responsiblePerson ?? "-",
              indicators,
            };
          })
        );

        setResultRows(withIndicators);
      } catch (e) {
        console.error("Error fetching result rows", e);
        setResultRows([]);
      } finally {
        setLoadingRows(false);
      }
    };

    fetchResultRows();
  }, [resultLevel, projectId, resultTypes, refreshKey]);

  // Build the URL for the Report Actual form, matching the pattern used in view-indicators.tsx
  const buildReportUrl = (indicator: RawIndicator): string => {
    const params = new URLSearchParams({
      orgKpiId: indicator.orgKpiId || "",
      resultTypeId: indicator.resultTypeId || "",
      resultId: indicator.resultId || "",
      indicatorSource: indicator.indicatorSource || "",
      thematicArea: indicator.thematicAreasOrPillar || "",
      statement: indicator.statement || "",
      responsiblePersons: indicator.responsiblePersons || "",
      baseLineDate: indicator.baseLineDate || "",
      cumulativeValue: indicator.cumulativeValue?.toString() || "",
      targetDate: indicator.targetDate || "",
      cumulativeTarget: (indicator.cumulativeTarget ?? indicator.target)?.toString() || "",
      definition: indicator.definition || "",
      unitOfMeasure: indicator.unitOfMeasure || "",
    });
    return `/projects/${projectId}/project-management/indicator/${indicator.indicatorId}/report?${params.toString()}`;
  };

  const handleDeleteIndicator = async () => {
    if (!indicatorToDelete) return;
    setIsDeleting(true);
    try {
      await indicatorApi.deleteIndicator(indicatorToDelete.indicatorId);
      toast.success("Indicator deleted.");
      setIndicatorToDelete(null);
      setActiveRowId(null);
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      console.error("Failed to delete indicator:", error);
      toast.error(error?.response?.data?.message || "Failed to delete indicator.");
    } finally {
      setIsDeleting(false);
    }
  };

  const setField = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Result-centric rows: each result is the parent, its indicators are children.
   * Optionally filtered by thematic area.
   */
  const resultTableRows = useMemo<ResultRow[]>(() => {
    const filtered = allThematicArea
      ? resultRows.filter(
          (r) => r.thematicArea?.toUpperCase() === allThematicArea.toUpperCase()
        )
      : resultRows;

    return filtered.map((result) => ({
      id: result.id,
      statement: result.statement,
      thematicArea: result.thematicArea,
      responsiblePerson: result.responsiblePerson,
      childIndicators: result.indicators.map((ind) => ({
        ...ind,
        id: ind.indicatorId,
      })),
    }));
  }, [resultRows, allThematicArea]);

  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  /** Columns — same count used for both parent (result) and child (indicator) rows */
  const tableHead = [
    "Result Statement",
    "Thematic Area",
    "Responsible Person",
    "Baseline",
    "Target",
    "Actual",
    "Performance",
    "Actions",
  ];

  return (
    <div className="space-y-5">
      <CardComponent fitWidth>
        {/* Filters */}
        <div className="flex grow flex-col md:flex-row mb-5 gap-4 md:items-center mt-10">
          <DropDown
            label="Thematic Area"
            value={allThematicArea}
            placeholder="Thematic Area"
            name="allThematicArea"
            onChange={(value: string) => setField("allThematicArea", value)}
            options={THEMATIC_AREAS_OPTIONS}
          />

          <DropDown
            label="Result Level"
            value={resultLevel}
            name="resultLevel"
            onChange={(value: string) => setField("resultLevel", value)}
            options={resultTypeOptions}
          />

          <DateRangePicker label="Date Range" />

          <DropDown
            label="Disaggregation"
            value={disaggregation}
            name="disaggregation"
            onChange={(value: string) => setField("disaggregation", value)}
            options={[
              { label: "Gender", value: "gender" },
              { label: "State", value: "state" },
              { label: "LGA", value: "lga" },
              { label: "Age", value: "age" },
              { label: "Product", value: "product" },
              { label: "Department", value: "department" },
              { label: "Tenure", value: "tenure" },
            ]}
          />
        </div>

        {/* Tabs */}
        <TabComponent
          width="80"
          data={tabs}
          persistKey={`project-${projectId}-tabs`}
          renderContent={(tabId) => {
            if (tabId === 1) {
              return (
                <div className="h-115 overflow-auto">
                  <ViewIndicators resultId={resultLevel} />
                </div>
              );
            } else {
              return (
                <div className="mt-4">
                  {loadingRows ? (
                    <div className="flex justify-center items-center py-16">
                      <div className="dots">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  ) : (
                    <TableWithAccordion<ResultRow, RawIndicator>
                      tableHead={tableHead}
                      tableData={resultTableRows}
                      childrenKey="childIndicators"
                      persistKey={`project-${projectId}-accordion`}
                      emptyStateMessage={resultLevel ? "No results found" : "Select a Result Level"}
                      emptyStateSubMessage={
                        resultLevel
                          ? "No results match the selected filters."
                          : "Choose a result level from the dropdown above to view results and their indicators."
                      }
                      renderRow={(result) => (
                        <>
                          <td className="px-6 py-3 text-xs text-gray-900 font-semibold max-w-xs">
                            {result.statement ?? ""}
                          </td>
                          <td className="px-6 py-3 text-xs text-gray-600">{result.thematicArea || ""}</td>
                          <td className="px-6 py-3 text-xs text-gray-600">{result.responsiblePerson || ""}</td>
                          {/* Indicator-specific metrics don't apply at the result level — left intentionally blank */}
                          <td className="px-6 py-3" />
                          <td className="px-6 py-3" />
                          <td className="px-6 py-3" />
                          <td className="px-6 py-3" />
                          <td className="px-6 py-3" />
                        </>
                      )}
                      renderChildRow={(indicator) => {
                        const baseline = indicator.cumulativeValue ?? indicator.baseline ?? null;
                        const target   = indicator.cumulativeTarget ?? indicator.target ?? null;
                        const actual   = indicator.actual ?? null;

                        const computedPerformance =
                          indicator.performance != null
                            ? indicator.performance
                            : target && actual != null
                            ? Math.round((actual / target) * 100)
                            : null;

                        return (
                          <>
                            <td className="px-6 py-3 pl-12 text-xs text-gray-700 max-w-xs">
                              {indicator.statement ?? ""}
                            </td>
                            {/* thematic area & responsible person not on indicator — left blank */}
                            <td className="px-6 py-3" />
                            <td className="px-6 py-3" />
                            <td className="px-6 py-3 text-xs text-gray-700">{baseline ?? 0}</td>
                            <td className="px-6 py-3 text-xs text-gray-700">{target ?? 0}</td>
                            <td className="px-6 py-3 text-xs text-gray-700">{actual ?? 0}</td>
                            <td className="px-6 py-3 text-xs text-gray-700">
                              {computedPerformance != null ? `${computedPerformance}%` : ""}
                            </td>
                            <td
                              className="px-6 py-2 relative"
                              onClick={(e) => e.stopPropagation()}>
                              <Icon
                                icon="uiw:more"
                                width={22}
                                height={22}
                                className="cursor-pointer"
                                color="#909CAD"
                                onClick={() =>
                                  setActiveRowId((prev) =>
                                    prev === indicator.indicatorId ? null : indicator.indicatorId,
                                  )
                                }
                              />
                              <ActionMenu
                                isOpen={activeRowId === indicator.indicatorId}
                                items={[
                                  {
                                    type: "link",
                                    label: "Edit",
                                    icon: "ph:pencil-simple-line",
                                    href: `/projects/${projectId}/project-management/indicator?indicatorId=${indicator.indicatorId}&mode=edit&resultId=${indicator.result || ""}&resultTypeId=${indicator.resultTypeId || ""}`,
                                  },
                                  {
                                    type: "button",
                                    label: "Delete",
                                    icon: "pixelarticons:trash",
                                    onClick: () => {
                                      setIndicatorToDelete(indicator);
                                      setActiveRowId(null);
                                    },
                                    className: "hover:text-(--primary-light) border-y border-gray-200",
                                  },
                                  {
                                    type: "link",
                                    label: "Report",
                                    icon: "fluent:document-add-24-regular",
                                    href: buildReportUrl(indicator),
                                  },
                                ]}
                              />
                            </td>
                          </>
                        );
                      }}
                    />
                  )}
                </div>
              );
            }
          }}
        />
      </CardComponent>

      <GenericDeleteModal
        isOpen={!!indicatorToDelete}
        onClose={() => setIndicatorToDelete(null)}
        onDelete={handleDeleteIndicator}
        heading="Delete Indicator"
        subtitle={`Are you sure you want to delete "${indicatorToDelete?.statement ?? "this indicator"}"? This cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}
