"use client";

import Modal from "@/ui/popup-modal";
import TabComponent from "@/ui/tab-component";
import { Icon } from "@iconify/react";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import BarChartComponent from "@/ui/bar-chart";
import LineChartComponent from "@/ui/line-chart";
import CommentsTab from "@/ui/comments-tab";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";

type FinancialOverviewType = {
  months: string[];
  budget: number[];
  actualSpending: number[];
};

type CommentsType = {
  indicatorReportCommentId: string;
  indicatorReportId: string;
  comment: string;
  createAt: string;
  updateAt?: string;
};

type KPIPerformanceType = {
  categories: string[];
  baseline: number[];
  target: number[];
};

type AnalyticsDataType = {
  comments: CommentsType[];
  financialOverview: FinancialOverviewType;
  kpiPerformance?: KPIPerformanceType; // Optional for now
};

type ViewAnalyticsProps = {
  isOpen: boolean;
  onClose: () => void;
  indicatorReportId?: string | number;
};

export default function ViewAnalytics({
  isOpen,
  onClose,
  indicatorReportId,
}: ViewAnalyticsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType | null>(null);

  // for tabs
  const tabs = [
    { id: 1, tabName: "KPI Performance" },
    { id: 2, tabName: "Financial Overview" },
    { id: 3, tabName: "Comments & Notes" },
  ];

  // Financial Overview chart lines
  const financialLines = [
    { key: "budget", label: "Budget", color: "#003B99" },
    { key: "expenditure", label: "Expenditure", color: "#EF4444" },
  ];

  // KPI Performance chart bars (you can update colors/labels when you get actual KPI data)
  const kpiBars = [
    { key: "baseline", label: "Baseline", color: "#003B99" },
    { key: "target", label: "Target", color: "#D2091E" },
  ];

  // Transform financial data for the line chart
  const getFinancialLineData = () => {
    if (!analyticsData?.financialOverview) {
      return []; // Return empty array if no data
    }

    const { months, budget, actualSpending } = analyticsData.financialOverview;
    
    return months.map((month, index) => ({
      name: month,
      budget: budget[index] || 0,
      expenditure: actualSpending[index] || 0,
    }));
  };

  // Transform KPI data for the bar chart - placeholder for now
  const getKPIData = () => {
    if (!analyticsData?.kpiPerformance) {
      // Return empty array since we don't have KPI data in the API yet
      return [];
    }

    const { categories, baseline, target } = analyticsData.kpiPerformance;
    
    return categories.map((category, index) => ({
      name: category,
      baseline: baseline[index] || 0,
      target: target[index] || 0,
    }));
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!indicatorReportId) return;
      
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/indicator-reports-overview/${indicatorReportId}`
        );
        setAnalyticsData(res.data.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && indicatorReportId) {
      fetchAnalytics();
    }
  }, [isOpen, indicatorReportId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="800px">
      <div className="flex justify-end mb-4 cursor-pointer">
        <Icon
          onClick={onClose}
          icon={"ic:round-close"}
          height={20}
          width={20}
        />
      </div>
      <TabComponent
        data={tabs}
        renderContent={(rowId) => {
          if (rowId === 1) {
            // KPI Performance Tab
            return (
              <div className="h-112.5">
                <CardComponent>
                  <Heading heading="KPI Performance" />
                  <div className="h-87.5">
                    {isLoading ? (
                      <div className="dots my-5 mx-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : getKPIData().length > 0 ? (
                      <BarChartComponent 
                        data={getKPIData()} 
                        xKey="name" 
                        bars={kpiBars} 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No KPI performance data available</p>
                      </div>
                    )}
                  </div>
                </CardComponent>
              </div>
            );
          } else if (rowId === 2) {
            // Financial Overview Tab
            return (
              <div className="h-112.5">
                <CardComponent>
                  <Heading heading="Financial Overview" />
                  <div className="h-87.5">
                    {isLoading ? (
                      <div className="dots my-20 mx-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : getFinancialLineData().length > 0 ? (
                      <LineChartComponent
                        lines={financialLines}
                        data={getFinancialLineData()}
                        legend
                        xKey="name"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No financial data available</p>
                      </div>
                    )}
                  </div>
                </CardComponent>
              </div>
            );
          } else {
            // Comments & Notes Tab
            return (
              <div className="h-112.5">
                <CardComponent>
                  <Heading heading="Comments & Notes" />
                  <div className="space-y-3 mt-2 overflow-y-auto h-87.5 custom-scrollbar pr-2">
                    {isLoading ? (
                      <div className="dots my-20 mx-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : analyticsData?.comments && analyticsData.comments.length > 0 ? (
                      analyticsData.comments.map((c) => (
                        <CommentsTab
                          key={c.indicatorReportCommentId}
                          date={formatDate(c.createAt)}
                          comment={c.comment}
                        />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No comments available</p>
                      </div>
                    )}
                  </div>
                </CardComponent>
              </div>
            );
          }
        }}
      />
    </Modal>
  );
}