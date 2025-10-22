"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import FileDisplay from "@/ui/file-display";
import TitleAndContent from "../super-admin-components/data-validation/title-content-component";
import Table from "@/ui/table";

type RequestProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FinancialRequestModal({
  isOpen,
  onClose,
}: RequestProps) {
  const [rejectRequest, setRejectRequest] = useState(false);
  const [approveRequest, setApproveRequest] = useState(false);

  const head = ["Quantity", "Frequency", "Unit Cost", "Total (₦)"];

  const data = [
    {
      quantity: 200,
      frequency: 200,
      unit_cost: 200,
      total: 600,
    },
    {
      quantity: 250,
      frequency: 200,
      unit_cost: 200,
      total: 650,
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="620px">
        <div className="overflow-y-auto h-[550px] custom-scrollbar p-2.5">
          <header className="border-b border-gray-300 text-center">
            <Heading heading="Review" />
          </header>
          <section className="space-y-4 my-5">
            <Heading
              heading="Financial Request"
              subtitle="Community Health Initiative - Submitted on May 15, 2023 at 10:30"
            />
            <h3 className="text-lg font-bold text-black my-2">
              Submission Details
            </h3>
            {/* submission details */}
            <div className="space-y-3 mb-5">
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Submitted by:</span>
                <span className="font-semibold text-gray-900"> John Doe</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Output:</span>
                <span className="font-semibold text-gray-900">
                  {" "}
                  Output Name
                </span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Activity Title:</span>
                <span className="font-semibold text-gray-900">
                  {" "}
                  Activity Title
                </span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Activity Budget Code:</span>
                <span className="font-semibold text-gray-900"> 000000</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Activity Locations:</span>
                <span className="font-semibold text-gray-900"> Location 1</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Activity Start Date:</span>
                <span className="font-semibold text-gray-900"> 12/04/2025</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Activity End Date:</span>
                <span className="font-semibold text-gray-900"> 12/04/2025</span>
              </p>
              <TitleAndContent
                title={"Activity Purpose/Description"}
                content={
                  "Conducted a 2-hour workshop with the client team to gather detailed requirements for the new dashboard feature. The session was highly productive with active participation from all stakeholders."
                }
              />
              {/* <TitleAndContent
                title={"Activity Line Description"}
                content={
                    "Conducted a 2-hour workshop with the client team to gather detailed requirements for the new dashboard feature. The session was highly productive with active participation from all stakeholders."
                }
                /> */}
              <Table
                tableHead={head}
                tableData={data}
                renderRow={(row) => (
                  <>
                    <td className="px-6">{row.quantity}</td>
                    <td className="px-6">{row.frequency}</td>
                    <td className="px-6">{row.unit_cost}</td>
                    <td className="px-6">{row.total}</td>
                  </>
                )}
              />
            </div>

            <Heading heading="Journey Management" sm />

            <div className="space-y-3">
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Mode of Transport:</span>
                <span className="font-semibold text-gray-900"> Road</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Driver&apos;s Name:</span>
                <span className="font-semibold text-gray-900"> John Doe</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">
                  Driver&apos;s Phone Number:
                </span>
                <span className="font-semibold text-gray-900">
                  {" "}
                  09039776534
                </span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Vehicle Color:</span>
                <span className="font-semibold text-gray-900"> Red</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Departure Date:</span>
                <span className="font-semibold text-gray-900"> 12/04/2025</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">Route:</span>
                <span className="font-semibold text-gray-900"> Red</span>
              </p>
              <p className="mb-2 text-sm">
                <span className="text-[#475367]">
                  Recipient&apos;s Phone Number:
                </span>
                <span className="font-semibold text-gray-900">
                  {" "}
                  09039776534
                </span>
              </p>
            </div>

            {/* attached evidence */}
            <div className="my-4">
              <h3 className="text-lg font-bold text-black my-3">
                Supporting Document
              </h3>
              {/* change to array or take from endpoint */}
              <FileDisplay filename="progress_photos.zip" filesize="15.2 MB" />
            </div>
          </section>
          <footer className="border-t border-gray-300 flex justify-center items-center pt-5 gap-6">
            <Button
              content="Reject"
              isSecondary
              onClick={() => setRejectRequest(true)}
            />
            <Button content="Approve" onClick={() => setApproveRequest(true)} />
          </footer>
        </div>
      </Modal>

      {/* reject modal */}
      <Modal isOpen={rejectRequest} onClose={() => setRejectRequest(false)}>
        <div className="flex flex-col gap-4 items-center">
          <Icon
            icon={"si:warning-line"}
            height={80}
            width={80}
            color="#D2091E"
          />
          <h1 className="text-[#101928] font-semibold text-[28px] text-center">
            Do you want to reject this request?
          </h1>
          <div className="flex gap-4 items-center">
            <Button content="Yes" isSecondary />
            <Button content="No" onClick={() => setRejectRequest(false)} />
          </div>
        </div>
      </Modal>

      {/* approve modal */}
      <Modal isOpen={approveRequest} onClose={() => setApproveRequest(false)}>
        <div className="flex flex-col gap-4 items-center">
          <Icon
            icon={"simple-line-icons:check"}
            height={80}
            width={80}
            color="#D2091E"
          />
          <Heading
            heading="Congratulations!"
            subtitle="Request successfully approved!"
          />
          <Button content="Close" onClick={() => setApproveRequest(false)} />
        </div>
      </Modal>
    </>
  );
}
