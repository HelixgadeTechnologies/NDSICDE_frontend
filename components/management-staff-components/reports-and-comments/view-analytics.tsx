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

type CommentsType = {
  indicatorReportCommentId: string;
  indicatorReportId: string;
  comment: string;
  createAt: string;
  updateAt?: string;
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
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [comments, setComments] = useState<CommentsType[]>([]);
  // for tabs
  const tabs = [
    { id: 1, tabName: "KPI Performance" },
    { id: 2, tabName: "Financial Overview" },
    { id: 3, tabName: "Comments & Notes" },
  ];

  const lines = [
    { key: "budget", label: "Budget", color: "#003B99" },
    { key: "expenditure", label: "Expenditure", color: "#EF4444" },
  ];

  const lineData = [
    { name: "Jan", budget: 60, expenditure: 70 },
    { name: "Feb", budget: 90, expenditure: 48 },
    { name: "Mar", budget: 40, expenditure: 60 },
    { name: "Apr", budget: 50, expenditure: 80 },
    { name: "May", budget: 55, expenditure: 55 },
    { name: "Jun", budget: 80, expenditure: 60 },
  ];

  const bars = [
    { key: "target", label: "Baseline", color: "#003B99" },
    { key: "actual", label: "Target", color: "#D2091E" },
  ];

  const barData = [
    { name: "Website Traffic", target: 120, actual: 190 },
    { name: "Social Engagement", target: 60, actual: 130 },
    { name: "Customer Retention", target: 30, actual: 18 },
  ];

  useEffect(() => {
    // fetch data
    const fetchComments = async () => {
      setIsFetchingComments(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/indicator-report-comments/${indicatorReportId}`,
        );
        setComments(res.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setIsFetchingComments(false);
      }
    };

    fetchComments();
  }, []);

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
            return (
              <div className="h-112.5">
                <CardComponent>
                  <Heading heading="KPI Performance" />
                  <div className="h-87.5">
                    <BarChartComponent data={barData} xKey="name" bars={bars} />
                  </div>
                </CardComponent>
              </div>
            );
          } else if (rowId === 2) {
            return (
              <div className="h-112.5">
                <CardComponent>
                  <Heading heading="Financial Overview" />
                  <div className="h-87.5">
                    <LineChartComponent
                      lines={lines}
                      data={lineData}
                      legend
                      xKey="name"
                    />
                  </div>
                </CardComponent>
              </div>
            );
          } else {
            return (
              <div className="h-112.5">
                <CardComponent>
                  <Heading heading="Comments & Notes" />
                  <div className="space-y-3 mt-2 overflow-y-auto h-87.5 custom-scrollbar pr-2">
                    {isFetchingComments ? (
                      <div className="dots my-20 mx-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      comments.map((c) => (
                        <CommentsTab
                          key={c.indicatorReportCommentId}
                          date={formatDate(c.createAt)}
                          comment={c.comment}
                        />
                      ))
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
