"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/utils/dates-format-utility";
import { toSentenceCase } from "@/utils/ui-utility";
import DashboardStat from "@/ui/dashboard-stat-card";
import CardComponent from "@/ui/card-wrapper";
import LoadingSpinner from "@/ui/loading-spinner";
import { Icon } from "@iconify/react";
import { useProjectRequests, useProjectRetirements } from "@/hooks/useProjectData";

const REQUEST_STEPS: Record<number, { label: string; color: string }> = {
  0: { label: "Awaiting SPO", color: "bg-orange-100 text-orange-700" },
  1: { label: "Security Officer", color: "bg-blue-100 text-blue-700" },
  2: { label: "Finance Officer", color: "bg-cyan-100 text-cyan-700" },
  3: { label: "Finance Manager", color: "bg-purple-100 text-purple-700" },
  4: { label: "Country Director", color: "bg-indigo-100 text-indigo-700" },
  5: { label: "Approved", color: "bg-green-100 text-green-700" },
};

const RETIREMENT_STEPS: Record<number, { label: string; color: string }> = {
  0: { label: "Finance Officer", color: "bg-cyan-100 text-cyan-700" },
  1: { label: "Finance Manager", color: "bg-purple-100 text-purple-700" },
  2: { label: "Country Director", color: "bg-indigo-100 text-indigo-700" },
  3: { label: "Approved", color: "bg-green-100 text-green-700" },
};

const STATUS_COLORS: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "In Review": "bg-blue-100 text-blue-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function ApproveRequestPage() {
  const tabs = [
    { tabName: "Activity Financial Requests", id: 1 },
    { tabName: "Activity Financial Retirements", id: 2 },
  ];
  const [activeTab, setActiveTab] = useState(1);

  const params = useParams();
  const projectId = (params?.id as string) || "";
  const router = useRouter();

  const { requests, isLoading: isLoadingRequests } = useProjectRequests(projectId);
  const { retirements, isLoading: isLoadingRetirements } = useProjectRetirements(projectId);

  const stats =
    activeTab === 1
      ? [
          { title: "Total Requests", value: requests.length, icon: "mdi:chart-box-outline" },
          {
            title: "Awaiting SPO",
            value: requests.filter((r) => (r.approvalStep ?? 0) === 0).length,
            icon: "mdi:clock-outline",
          },
          {
            title: "In Review",
            value: requests.filter((r) => r.status === "In Review").length,
            icon: "mdi:eye-outline",
          },
          {
            title: "Approved",
            value: requests.filter((r) => (r.approvalStep ?? 0) === 5).length,
            icon: "mdi:check-circle-outline",
          },
        ]
      : [
          { title: "Total Retirements", value: retirements.length, icon: "mdi:chart-box-outline" },
          {
            title: "Awaiting Finance Officer",
            value: retirements.filter((r) => (r.approvalStep ?? 0) === 0).length,
            icon: "mdi:clock-outline",
          },
          {
            title: "In Review",
            value: retirements.filter((r) => r.retirementStatus === "In Review").length,
            icon: "mdi:eye-outline",
          },
          {
            title: "Approved",
            value: retirements.filter((r) => (r.approvalStep ?? 0) >= 3).length,
            icon: "mdi:check-circle-outline",
          },
        ];

  return (
    <div className="mt-12 space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardStat data={stats} icon="basil:plus-solid" />
      </div>

      <CardComponent fitWidth={true}>
        {/* Tab switcher */}
        <div className="w-full relative h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg mb-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative z-10">
                {isActive && (
                  <motion.div
                    layoutId="approve-tab"
                    className="absolute inset-0 z-0 bg-white rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div
                  className={`relative z-10 px-3 md:px-6 h-10 flex items-center justify-center font-bold text-xs md:text-sm cursor-pointer whitespace-nowrap ${
                    isActive ? "text-[#242424]" : "text-[#7A7A7A]"
                  }`}>
                  {tab.tabName}
                </div>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}>
            {/* ── Requests tab ── */}
            {activeTab === 1 &&
              (isLoadingRequests ? (
                <LoadingSpinner />
              ) : requests.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                  <Icon icon="mdi:inbox-outline" width={48} height={48} />
                  <p className="text-sm font-medium">No requests found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((row) => {
                    const totalBudget = (row.lineItems || []).reduce(
                      (sum, item) => sum + (item.totalBudget || 0),
                      0,
                    );
                    const stepInfo =
                      row.approvalStep !== undefined && row.approvalStep !== null
                        ? REQUEST_STEPS[row.approvalStep]
                        : REQUEST_STEPS[0];
                    const statusColor =
                      STATUS_COLORS[row.status || "Pending"] || "bg-gray-100 text-gray-600";

                    return (
                      <div
                        key={row.requestId}
                        onClick={() =>
                          router.push(
                            `/projects/${projectId}/project-management/approve-request/view?requestId=${row.requestId}&type=request`,
                          )
                        }
                        className="group flex items-center justify-between gap-6 bg-white border border-gray-200 rounded-xl px-6 py-5 cursor-pointer hover:border-[#D2091E] hover:shadow-md transition-all duration-200">
                        {/* Left: icon + main info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="mt-0.5 shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <Icon
                              icon="mdi:file-document-outline"
                              width={20}
                              height={20}
                              className="text-[#D2091E]"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">
                                {toSentenceCase(row.activityTitle ?? "Untitled Activity")}
                              </h3>
                              {stepInfo && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${stepInfo.color}`}>
                                  {stepInfo.label}
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                                {row.status || "Pending"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                              {row.staff && (
                                <span className="flex items-center gap-1">
                                  <Icon icon="mdi:account-outline" width={13} height={13} />
                                  {toSentenceCase(row.staff)}
                                </span>
                              )}
                              {row.activityLocation && (
                                <span className="flex items-center gap-1">
                                  <Icon icon="mdi:map-marker-outline" width={13} height={13} />
                                  {row.activityLocation}
                                </span>
                              )}
                              {row.activityStartDate && (
                                <span className="flex items-center gap-1">
                                  <Icon icon="mdi:calendar-outline" width={13} height={13} />
                                  {formatDate(row.activityStartDate, "date-only")}
                                  {row.activityEndDate &&
                                    ` — ${formatDate(row.activityEndDate, "date-only")}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: budget + chevron */}
                        <div className="flex items-center gap-5 shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-400 mb-0.5">Total Budget</p>
                            <p className="font-bold text-gray-900 text-sm">
                              ₦{totalBudget.toLocaleString()}
                            </p>
                          </div>
                          <Icon
                            icon="mdi:chevron-right"
                            width={20}
                            height={20}
                            className="text-gray-300 group-hover:text-[#D2091E] transition-colors"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

            {/* ── Retirements tab ── */}
            {activeTab === 2 &&
              (isLoadingRetirements ? (
                <LoadingSpinner />
              ) : retirements.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                  <Icon icon="mdi:inbox-outline" width={48} height={48} />
                  <p className="text-sm font-medium">No retirements found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {retirements.map((row) => {
                    const stepInfo =
                      row.approvalStep !== undefined && row.approvalStep !== null
                        ? RETIREMENT_STEPS[row.approvalStep]
                        : RETIREMENT_STEPS[0];
                    const statusColor =
                      STATUS_COLORS[row.retirementStatus || "Pending"] ||
                      "bg-gray-100 text-gray-600";
                    const variance = (row.totalBudget || 0) - (row.actualCost || 0);

                    return (
                      <div
                        key={row.retirementId}
                        onClick={() =>
                          router.push(
                            `/projects/${projectId}/project-management/approve-request/view?retirementId=${row.retirementId}&type=retirement`,
                          )
                        }
                        className="group flex items-center justify-between gap-6 bg-white border border-gray-200 rounded-xl px-6 py-5 cursor-pointer hover:border-[#D2091E] hover:shadow-md transition-all duration-200">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="mt-0.5 shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <Icon
                              icon="mdi:file-chart-outline"
                              width={20}
                              height={20}
                              className="text-[#D2091E]"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">
                                {toSentenceCase(row.requestActivityTitle || "Untitled Retirement")}
                              </h3>
                              {stepInfo && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${stepInfo.color}`}>
                                  {stepInfo.label}
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                                {row.retirementStatus === "Approved"
                                  ? "Approved & Closed"
                                  : row.retirementStatus || "Pending"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Icon icon="mdi:bank-outline" width={13} height={13} />
                                Budget: ₦{(row.totalBudget || 0).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon icon="mdi:receipt-outline" width={13} height={13} />
                                Actual: ₦{(row.actualCost || 0).toLocaleString()}
                              </span>
                              <span
                                className={`flex items-center gap-1 font-medium ${variance >= 0 ? "text-green-600" : "text-red-500"}`}>
                                <Icon icon="mdi:delta" width={13} height={13} />
                                {variance >= 0 ? "+" : "-"}₦
                                {Math.abs(variance).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Icon
                          icon="mdi:chevron-right"
                          width={20}
                          height={20}
                          className="text-gray-300 group-hover:text-[#D2091E] transition-colors shrink-0"
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
          </motion.div>
        </AnimatePresence>
      </CardComponent>
    </div>
  );
}
