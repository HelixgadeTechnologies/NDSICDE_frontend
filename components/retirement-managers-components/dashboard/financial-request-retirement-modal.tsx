"use client";

import { RetirementRequest } from "@/types/retirement-request";
import { Icon } from "@iconify/react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TabComponent from "@/ui/tab-component";
import CommentsAndNotes from "./comments-and-notes";
import TitleAndContent from "@/components/admin-components/data-validation/title-content-component";
import FileDisplay from "@/ui/file-display";
import Button from "@/ui/form/button";

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
      <div className="border border-gray-200 rounded-[10px] px-4 py-8 h-[550px] my-5">
        <TabComponent
          data={tabs}
          renderContent={(tabId) => {
            if (tabId === 1) {
              return <RequestOverview request={request} />;
            } else {
              return <CommentsAndNotes />;
            }
          }}
        />
      </div>
    </Modal>
  );
}

type OverviewProps = {
  request: RetirementRequest;
};

function RequestOverview({ request }: OverviewProps) {
  return (
    <div className="custom-scrollbar h-[440px] pr-4 overflow-y-auto">
      <Heading
        heading="Request and Retirement"
        subtitle={`${request.activityLineDesc} - Submitted on May 15, 2023 at 10:30`}
      />
      <div className="mt-6">
        <h4 className="text-lg font-bold text-black">Submission Details</h4>
        <div className="my-4 text-[#475367] font-normal text-base space-y-4">
          <p className="spacey-x-1">
            <span>Submitted By: </span>
            <span className="text-black font-semibold">John Doe</span>
          </p>
          <p className="spacey-x-1">
            <span>Output: </span>
            <span className="text-black font-semibold">Output Name</span>
          </p>
          <p className="spacey-x-1">
            <span>Activity Title: </span>
            <span className="text-black font-semibold">Activity Title</span>
          </p>
          <p className="spacey-x-1">
            <span>Activity Budget Code: </span>
            <span className="text-black font-semibold">000000</span>
          </p>
          <p className="spacey-x-1">
            <span>Activity Location: </span>
            <span className="text-black font-semibold">Port Harcourt</span>
          </p>
          <TitleAndContent
          base
          title="Activity Purpose/Description"
          content="Conducted a 2-hour workshop with the client team to gather detailed requirements for the new dashboard feature. The session was highly productive with active participation from all stakeholders."
          />
          <p className="spacey-x-1">
            <span>Activity Start Date: </span>
            <span className="text-black font-semibold">12/04/2025</span>
          </p>
          <p className="spacey-x-1">
            <span>Activity End Date: </span>
            <span className="text-black font-semibold">12/04/2025</span>
          </p>
          <TitleAndContent
          base
          title="Activity Line Description"
          content="Conducted a 2-hour workshop with the client team to gather detailed requirements for the new dashboard feature. The session was highly productive with active participation from all stakeholders."
          />
          <p className="spacey-x-1">
            <span>Quantity: </span>
            <span className="text-black font-semibold">200</span>
          </p>
          <p className="spacey-x-1">
            <span>Frequency: </span>
            <span className="text-black font-semibold">200</span>
          </p>
          <p className="spacey-x-1">
            <span>Unit Cost (₦): </span>
            <span className="text-black font-semibold">200</span>
          </p>
          <p className="spacey-x-1">
            <span>Budget Code: </span>
            <span className="text-black font-semibold">000000</span>
          </p>
          <p className="spacey-x-1">
            <span>Total (₦):  </span>
            <span className="text-black font-semibold">200</span>
          </p>
        </div>

        {/* <Heading
        heading="Request and Retirement"
        subtitle={`${request.activityLineDesc} - Submitted on May 15, 2023 at 10:30`}
      /> */}

      <div className="my-4 text-[#475367] font-normal text-base space-y-4">
          <p className="spacey-x-1">
            <span>Mode of Transport: </span>
            <span className="text-black font-semibold">Road</span>
          </p>
          <p className="spacey-x-1">
            <span>Driver&apos;s Name: </span>
            <span className="text-black font-semibold">John Doe</span>
          </p>
          <p className="spacey-x-1">
            <span>Driver&apos;s Phone Number: </span>
            <span className="text-black font-semibold">09039776534</span>
          </p>
          <p className="spacey-x-1">
            <span>Vehicle Color: </span>
            <span className="text-black font-semibold">Red</span>
          </p>
          <p className="spacey-x-1">
            <span>Departure Date: </span>
            <span className="text-black font-semibold">12/04/2025</span>
          </p>
          <p className="spacey-x-1">
            <span>Route: </span>
            <span className="text-black font-semibold">Red</span>
          </p>
          <p className="spacey-x-1">
            <span>Recipient&apos;s Phone Number:  </span>
            <span className="text-black font-semibold">09039776534</span>
          </p>
        </div>

        <div className="my-4 space-y-3">
            <Heading heading="Supporting Document" sm /> 
            <FileDisplay
            filename="progress_photos.zip"
            filesize="15.2 MB"
            />
        </div>
      </div>

      <div className="flex gap-6 items-center my-6">
        <div className="w-2/5">
            <Button content="Reject" isSecondary />
        </div>
        <div className="w-3/5">
            <Button content="Approve"/>
        </div>
      </div>
    </div>
  );
}
