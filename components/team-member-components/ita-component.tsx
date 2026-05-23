"use client";

import CardComponent from "@/ui/card-wrapper";
import TableWithAccordion from "@/ui/table-with-accordion";
import Heading from "@/ui/text-heading";
import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";
import { toSentenceCase } from "@/utils/ui-utility";

type OutputRow =
  ProjectFinancialDashboardResponse["IMPLEMENTATION_TIME_ANALYSIS"][number];
type ActivityRow = OutputRow["activities"][number];

export default function ImplementationTimeAnalysisComponent({
  statData,
}: {
  statData?: ProjectFinancialDashboardResponse | null;
}) {
  const tableData = statData?.IMPLEMENTATION_TIME_ANALYSIS ?? [];

  const head = [
    "Output / Activity",
    "Total Activity Planned Days",
    "Total Activity Spent Days",
    "(Days Spent) %",
    "Earned Value (EV)",
    "Planned Value (PV)",
    "Status",
    "Cost Variance",
  ];

  return (
    <CardComponent>
      <Heading
        heading="Implementation Time Analysis"
        subtitle="Planned vs. actual timeline for project activities"
        className="mb-4"
      />
      <TableWithAccordion<OutputRow, ActivityRow>
        tableHead={head}
        tableData={tableData}
        itemsPerPage={2}
        childrenKey="activities"
        persistKey="ita-table"
        pdfTitle="Implementation Time Analysis"
        emptyStateMessage="No implementation time data"
        emptyStateSubMessage="There are no activity time records to display yet."
        renderRow={(output) => (
          <>
            <td className="px-6 text-sm text-gray-700">
              {toSentenceCase(output.outputStatement) || "—"}
            </td>
            <td className="px-6 text-sm text-gray-700">
              {output.totalPlannedDays ?? "-"}
            </td>
            <td className="px-6 text-sm text-gray-700">
              {output.totalActualDays ?? "-"}
            </td>
            {/* Activity-level metrics live on the child rows */}
            <td className="px-6" />
            <td className="px-6" />
            <td className="px-6" />
            <td className="px-6" />
            <td className="px-6" />
          </>
        )}
        renderChildRow={(activity) => (
          <>
            <td
              className="px-6 text-sm text-gray-700 max-w-xs"
              title={activity.activityDescription}>
              {activity.activityDescription ?? "—"}
            </td>
            <td className="px-6 text-sm text-gray-700">
              {activity.totalPlannedDays ?? "-"}
            </td>
            <td className="px-6 text-sm text-gray-700">
              {activity.totalActivitySpentDays ?? "-"}
            </td>
            <td className="px-6 text-sm text-gray-700">
              {activity.percentageDaysSpent ?? 0}%
            </td>
            <td className="px-6 text-sm text-gray-700">
              {activity.earnedValue ?? "-"}
            </td>
            <td className="px-6 text-sm text-gray-700">
              {activity.plannedValue ?? "-"}
            </td>
            <td className="px-6 text-sm text-gray-700">
              {activity.status ?? "—"}
            </td>
            <td className="px-6 text-sm text-gray-700">
              {activity.costVariance ?? "-"}
            </td>
          </>
        )}
      />
    </CardComponent>
  );
}
