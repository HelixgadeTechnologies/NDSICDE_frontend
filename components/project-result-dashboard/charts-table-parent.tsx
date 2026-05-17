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
              indicators = indRes.data?.data || [];
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
  }, [resultLevel, projectId, resultTypes]);

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
    // "Status",
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
                <div className="h-[460px] overflow-auto">
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
                          <td className="px-6 text-xs text-gray-800 font-medium max-w-xs">
                            <div className="flex items-center gap-2 pb-4">
                              {result.statement ?? "-"}
                            </div>
                          </td>
                          <td className="px-6 text-xs text-gray-600">{result.thematicArea || "-"}</td>
                          <td className="px-6 text-xs text-gray-600">{result.responsiblePerson || "-"}</td>
                          {/* indicator-specific columns not applicable at result level */}
                          <td className="px-6 text-xs text-gray-300">—</td>
                          <td className="px-6 text-xs text-gray-300">—</td>
                          <td className="px-6 text-xs text-gray-300">—</td>
                          <td className="px-6 text-xs text-gray-300">—</td>
                          {/* <td className="px-6 text-xs text-gray-300">—</td> */}
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
                            <td className="px-6 py-2 text-xs text-gray-700 max-w-xs">
                              {indicator.statement ?? "-"}
                            </td>
                            {/* thematic area & responsible person not on indicator */}
                            <td className="px-6 py-2 text-xs text-gray-300">—</td>
                            <td className="px-6 py-2 text-xs text-gray-300">—</td>
                            <td className="px-6 py-2 text-xs text-gray-700">{baseline ?? 0}</td>
                            <td className="px-6 py-2 text-xs text-gray-700">{target ?? 0}</td>
                            <td className="px-6 py-2 text-xs text-gray-700">{actual ?? 0}</td>
                            <td className="px-6 py-2 text-xs text-gray-700">
                              {computedPerformance != null ? `${computedPerformance}%` : "—"}
                            </td>
                            {/* <td
                              className={`px-6 py-2 text-xs font-medium ${
                                indicator.status === "Met"
                                  ? "text-[#22C55E]"
                                  : indicator.status
                                  ? "text-[#EAB308]"
                                  : "text-gray-400"
                              }`}
                            >
                              {indicator.status || "-"}
                            </td> */}
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
    </div>
  );
}
