"use client";

import { useMemo, useState, useEffect } from "react";
import CardComponent from "@/ui/card-wrapper";
import TabComponent from "@/ui/tab-component";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import { ProjectResultResponse } from "@/types/project-result-dashboard";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import { fetchResultTypes, ResultType, transformResultTypesToOptions } from "@/lib/api/result-types";
import ViewIndicators from "../team-member-components/view-indicators";
import TableWithAccordion from "@/ui/table-with-accordion";
import axios from "axios";

// types 

type IndicatorChild = {
  indicatorId: string;
  statement: string;
  baseline: number;
  target: number;
  actual: number;
  performance: number;
  status: string;
  [key: string]: any;
};

type ResultParentRow = {
  id: string;
  statement: string;
  thematicArea: string;
  responsiblePerson: string;
  indicators: IndicatorChild[];
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
  const [filters, setFilters] = useState({
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

  // Parent result rows with nested indicators
  const [resultRows, setResultRows] = useState<ResultParentRow[]>([]);
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

        // For each parent row, fetch its indicators
        const withIndicators: ResultParentRow[] = await Promise.all(
          rows.map(async (row) => {
            const resultId = row[idKey];
            let indicators: IndicatorChild[] = [];
            try {
              const indRes = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicators/${resultId}`
              );
              indicators = indRes.data?.data || [];
            } catch {
              // leave indicators empty if fetch fails
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

  // Filtered parent rows by thematic area
  const filteredResultRows = useMemo(() => {
    if (!allThematicArea) return resultRows;
    return resultRows.filter((r) =>
      r.thematicArea?.toUpperCase() === allThematicArea.toUpperCase()
    );
  }, [resultRows, allThematicArea]);

  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  const tableHead = [
    "Indicator Statement",
    "Baseline",
    "Target",
    "Actual",
    "Performance",
    "Status",
  ];

  const childTableHead = [
    "Indicator Statement",
    "Baseline",
    "Target",
    "Actual",
    "Performance",
    "Status",
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
                    <TableWithAccordion<ResultParentRow, IndicatorChild>
                      tableHead={tableHead}
                      tableData={filteredResultRows}
                      childrenKey="indicators"
                      emptyStateMessage={resultLevel ? "No results found" : "Select a Result Level"}
                      emptyStateSubMessage={
                        resultLevel
                          ? "No records match the selected filters."
                          : "Choose a result level from the dropdown above to view results and their indicators."
                      }
                      renderRow={(row, _i, isOpen) => (
                        <>
                          <td className="px-6 text-xs md:text-xs text-gray-800 max-w-xs">
                            <div className="flex items-center gap-2 pb-4">
                              {row.statement}
                            </div>
                          </td>
                          <td className="px-6 text-xs text-gray-400">—</td>
                          <td className="px-6 text-xs text-gray-400">—</td>
                          <td className="px-6 text-xs text-gray-400">—</td>
                          <td className="px-6 text-xs text-gray-400">—</td>
                          <td className="px-6 text-xs text-gray-400">—</td>
                        </>
                      )}
                      renderChildRow={(child) => (
                        <>
                          <td className="px-6 py-2 text-xs text-gray-700">{child.statement ?? "-"}</td>
                          <td className="px-6 py-2 text-xs text-gray-600">{child.baseline ?? "-"}</td>
                          <td className="px-6 py-2 text-xs text-gray-600">{child.target ?? "-"}</td>
                          <td className="px-6 py-2 text-xs text-gray-600">{child.actual ?? "-"}</td>
                          <td className="px-6 py-2 text-xs text-gray-600">{child.performance ?? 0}%</td>
                          <td
                            className={`px-6 py-2 text-xs font-medium ${
                              child.status === "Met" ? "text-[#22C55E]" : "text-[#EAB308]"
                            }`}
                          >
                            {child.status || "-"}
                          </td>
                        </>
                      )}
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
