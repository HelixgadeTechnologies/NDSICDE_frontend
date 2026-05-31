"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import ActionMenu from "@/ui/action-menu";
import DeleteModal from "@/ui/generic-delete-modal";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";

type IndicatorReport = {
  indicatorReportId: string;
  indicatorSource: string;
  orgKpiId: string;
  thematicAreasOrPillar: string;
  indicatorStatement: string;
  responsiblePersons: string;
  actualDate: string;
  cumulativeActual: string;
  actualNarrative: string;
  attachmentUrl: string;
  status: string;
  indicatorId: string;
  resultTypeId: string;
  IndicatorReportDisaggregation?: Array<{
    indicatorReportDisaggregationId: string;
    indicatorReportId: string;
    type: string;
    category: string;
    actual: number;
  }>;
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  APPROVE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  DECLINE: "bg-red-50 text-red-700 border border-red-200",
};

export default function ViewActualValue() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<IndicatorReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<IndicatorReport | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params?.id as string;
  const indicatorId = params?.indicatorId as string;
  const resultId = searchParams.get("resultId") || "";
  const token = getToken();

  const head = [
    "Indicator Source",
    "Thematic Areas",
    "Indicator Statement",
    "Responsible Person(s)",
    "Actual Date",
    "Cumulative Actual",
    "Status",
    "Actions",
  ];

  const fetchReports = async () => {
    if (!resultId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicator-report/getByResultId/${resultId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const payload = response.data;
      // Support both `{success, data: [...]}` and a bare array response
      const allReports: IndicatorReport[] = Array.isArray(payload)
        ? payload
        : payload?.data ?? [];
      // Endpoint returns every report under the parent result — narrow to this indicator
      const reports = allReports.filter((r) => r.indicatorId === indicatorId);
      setData(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports for this indicator.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultId, indicatorId]);

  const handleEdit = (report: IndicatorReport) => {
    setActiveRowId(null);
    router.push(
      `/projects/${projectId}/project-management/indicator/${indicatorId}/report?reportId=${report.indicatorReportId}&resultId=${resultId}`,
    );
  };

  const openDelete = (report: IndicatorReport) => {
    setSelectedReport(report);
    setIsDeleteOpen(true);
    setActiveRowId(null);
  };

  const openApprove = (report: IndicatorReport) => {
    setSelectedReport(report);
    setIsApproveOpen(true);
    setActiveRowId(null);
  };

  const handleDelete = async () => {
    if (!selectedReport) return;
    setIsDeleting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicator-report/delete`,
        { id: selectedReport.indicatorReportId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Report deleted successfully.");
      setIsDeleteOpen(false);
      setSelectedReport(null);
      await fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReport) return;
    setIsApproving(true);
    try {
      // Reuses the same POST endpoint with isCreate: false to update status
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicator_report`,
        {
          isCreate: false,
          payload: {
            ...selectedReport,
            status: "APPROVE",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Report approved.");
      setIsApproveOpen(false);
      setSelectedReport(null);
      await fetchReports();
    } catch (error) {
      console.error("Error approving report:", error);
      toast.error("Failed to approve report. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <section className="relative md:mt-12 w-full max-w-300 mx-auto pb-12">
      <div className="md:absolute md:right-0 md:-top-18.75 mb-4 md:mb-0">
        <Button
          content="Report Actual Value"
          icon="si:add-fill"
          onClick={() =>
            router.push(
              `/projects/${projectId}/project-management/indicator/${indicatorId}/report?resultId=${resultId}`,
            )
          }
        />
      </div>

      <CardComponent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <Table
            tableHead={head}
            tableData={data}
            idKey={"indicatorReportId"}
            emptyStateMessage="No reports yet"
            emptyStateSubMessage="There are no submitted reports for this indicator. Click 'Report Actual Value' to add one."
            renderRow={(row) => {
              const statusKey = (row.status || "").toUpperCase();
              const statusClass =
                STATUS_STYLES[statusKey] ||
                "bg-gray-50 text-gray-600 border border-gray-200";
              return (
                <>
                  <td className="px-6">{row.indicatorSource || "N/A"}</td>
                  <td className="px-6">{row.thematicAreasOrPillar || "N/A"}</td>
                  <td className="px-6">{row.indicatorStatement || "N/A"}</td>
                  <td className="px-6">{row.responsiblePersons || "N/A"}</td>
                  <td className="px-6">
                    {row.actualDate ? formatDate(row.actualDate, "date-only") : "N/A"}
                  </td>
                  <td className="px-6">{row.cumulativeActual || "N/A"}</td>
                  <td className="px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                      {statusKey || "N/A"}
                    </span>
                  </td>
                  <td
                    className="px-6 relative"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center items-center">
                      <Icon
                        icon={"uiw:more"}
                        width={22}
                        height={22}
                        className="cursor-pointer"
                        color="#909CAD"
                        onClick={() =>
                          setActiveRowId((prev) =>
                            prev === row.indicatorReportId
                              ? null
                              : row.indicatorReportId,
                          )
                        }
                      />
                    </div>
                    <ActionMenu
                      isOpen={activeRowId === row.indicatorReportId}
                      onClose={() => setActiveRowId(null)}
                      items={[
                        {
                          type: "button",
                          label: "Edit",
                          icon: "ph:pencil-simple-line",
                          onClick: () => handleEdit(row),
                        },
                        // {
                        //   type: "button",
                        //   label: "Approve",
                        //   icon: "ph:check-circle",
                        //   onClick: () => openApprove(row),
                        //   className:
                        //     "border-y border-gray-300 hover:text-emerald-600",
                        // },
                        {
                          type: "button",
                          label: "Delete",
                          icon: "pixelarticons:trash",
                          onClick: () => openDelete(row),
                          className: "hover:text-(--primary-light) border-t border-gray-300",
                        },
                      ]}
                    />
                  </td>
                </>
              );
            }}
          />
        )}
      </CardComponent>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedReport(null);
        }}
        heading="Delete this indicator report?"
        subtitle="This action cannot be undone."
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isApproveOpen}
        onClose={() => {
          setIsApproveOpen(false);
          setSelectedReport(null);
        }}
        maxWidth="400px">
        <div className="flex justify-center text-emerald-600 mb-4">
          <Icon icon="ph:check-circle" width={96} height={96} />
        </div>
        <Heading
          heading="Approve this indicator report?"
          subtitle="The report's status will be set to APPROVE."
          className="text-center"
        />
        <div className="mt-4 flex justify-center mx-auto gap-2 w-45">
          <Button
            content="No"
            onClick={() => {
              setIsApproveOpen(false);
              setSelectedReport(null);
            }}
            isSecondary
          />
          <Button
            content="Yes"
            isLoading={isApproving}
            onClick={handleApprove}
          />
        </div>
      </Modal>
    </section>
  );
}
