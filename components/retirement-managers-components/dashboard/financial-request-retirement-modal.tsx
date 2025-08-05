"use client";

import { RetirementRequest } from "@/types/retirement-request";
import { Icon } from "@iconify/react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TabComponent from "@/ui/tab-component";
import CommentsAndNotes from "./comments-and-notes";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  request: RetirementRequest;
};

export default function FinancialRequestAndRetirementModal({
  isOpen,
  onClose,
  request,
}: ModalProps) {
  const tabs = [
    { tabName: "Request Overview", id: 1 },
    { tabName: "Commments & Notes", id: 2 },
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px">
      <div className="flex justify-between items-center">
        <Heading heading="Financial Request and Retirement" />
        <Icon
          onClick={onClose}
          icon={"ic:round-close"}
          height={24}
          width={24}
        />
      </div>
      <div className="border border-gray-200 rounded-[10px] px-6 py-8 custom-scrollbar h-[550px] my-5">
        <TabComponent 
        data={tabs} 
        renderContent={(tabId => {
            if (tabId === 1) {
                return 'first'
            } else {
                return <CommentsAndNotes/>
            }
        })}
        />
      </div>
    </Modal>
  );
}
