"use client";

import Modal from "@/ui/popup-modal";
import TabComponent from "@/ui/tab-component";
import { Icon } from "@iconify/react";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import BarChartComponent from "@/ui/bar-chart";
import LineChartComponent from "@/ui/line-chart";
import CommentsTab from "@/ui/comments-tab";
import { comments } from "@/lib/config/charts";

type ViewAnalyticsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ViewAnalytics({ isOpen, onClose }: ViewAnalyticsProps) {
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
              <div className="h-[450px]">
                <CardComponent>
                  <Heading heading="KPI Performance" />
                  <div className="h-[350px]">
                    <BarChartComponent data={barData} xKey="name" bars={bars} />
                  </div>
                </CardComponent>
              </div>
            );
          } else if (rowId === 2) {
            return (
              <div className="h-[450px]">
                <CardComponent>
                  <Heading heading="Financial Overview" />
                  <div className="h-[350px]">
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
              <div className="h-[450px]">
                <CardComponent>
                  <Heading heading="Comments & Notes" />
                  <div className="space-y-3 mt-2">
                    {comments.map((c) => (
                      <CommentsTab
                        key={c.id}
                        name={c.name}
                        date={c.date}
                        time={c.time}
                        comment={c.comment}
                      />
                    ))}
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
