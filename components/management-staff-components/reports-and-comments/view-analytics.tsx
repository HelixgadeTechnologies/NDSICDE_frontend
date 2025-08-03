"use client";

import Modal from "@/ui/popup-modal";
import TabComponent from "@/ui/tab-component";
import { Icon } from "@iconify/react";

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
            return "kpi";
          } else if (rowId === 2) {
            return "finance";
          } else {
            return "comments";
          }
        }}
      />
    </Modal>
  );
}
