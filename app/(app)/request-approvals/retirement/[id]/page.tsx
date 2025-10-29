"use client";

import { useState } from "react";
import Modal from "@/ui/popup-modal";
import Button from "@/ui/form/button";
import FileDisplay from "@/ui/file-display";
import Table from "@/ui/table";
import {
  FileText,
  DollarSign,
} from "lucide-react";
import CardComponent from "@/ui/card-wrapper";
import BackButton from "@/ui/back-button";
// import DeleteModal from "@/ui/generic-delete-modal";
import TextareaInput from "@/ui/form/textarea";

export default function FinancialRequestModal() {
  // const [rejectRequest, setRejectRequest] = useState(false);
  // const [approveRequest, setApproveRequest] = useState(false);
  const [reviewRequest, setReviewRequest] = useState(false);

  const head = [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost",
    "Total (₦)",
  ];

  const data = [
    {
      description: "Lorem ipsum dolor sit amet. lorem ipsum dolor sit amet",
      quantity: 200,
      frequency: 200,
      unit_cost: 200,
      total: 600,
    },
    {
      description: "Lorem ipsum dolor sit amet",
      quantity: 250,
      frequency: 200,
      unit_cost: 200,
      total: 650,
    },
  ];

  return (
    <>
      <BackButton />
      <div className="grid grid-cols-3 gap-3">
        {/* retired actual budget card */}
        <div className="col-span-2">
          <CardComponent>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D2091E]" />
              Retired Actual Budget
            </h3>
            <Table
              tableHead={head}
              tableData={data}
              renderRow={(row) => (
                <>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <p className="w-[160px] truncate">{row.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.frequency}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₦{row.unit_cost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₦{row.total.toLocaleString()}
                  </td>
                </>
              )}
            />
            {/* grand total */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600">Grand Total</p>
                <p className="text-2xl font-bold text-gray-900">₦1,250</p>
              </div>
            </div>
          </CardComponent>
        </div>
        {/* Supporting Documents Card */}
        <CardComponent>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D2091E]" />
            Supporting Documents
          </h3>
          <div className="space-y-1">
            <FileDisplay filename="progress_photos.zip" filesize="15.2 MB" />
            <FileDisplay filename="aggregated_files.docx" filesize="27 MB" />
            <FileDisplay filename="day_one_images.zip" filesize="10 KB" />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            {/* <Button content="Approve" onClick={() => setApproveRequest(true)} /> */}
            <Button
              content="Review"
              isSecondary
              onClick={() => setReviewRequest(true)}
            />
            {/* <Button
              content="Reject"
              isSecondary
              onClick={() => setRejectRequest(true)}
            /> */}
          </div>
        </CardComponent>
      </div>
      {/* Reject Modal */}
      {/* <DeleteModal
        isOpen={rejectRequest}
        onClose={() => setRejectRequest(false)}
        heading="Do you want to delete this Request"
      /> */}

      {/* Approve Modal */}
      {/* <Modal isOpen={approveRequest} onClose={() => setApproveRequest(false)}>
        <div className="flex flex-col gap-4 items-center p-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <Icon
              icon="simple-line-icons:check"
              height={48}
              width={48}
              color="#27AE60"
            />
          </div>
          <Heading
            heading="Congratulations!"
            subtitle="Request successfully approved!"
          />
          <Button content="Close" onClick={() => setApproveRequest(false)} />
        </div>
      </Modal> */}

      {/* review modal */}
      <Modal
        isOpen={reviewRequest}
        onClose={() => setReviewRequest(false)}
        maxWidth="500px">
        <div className="space-y-6">
          <TextareaInput
            label="Review Comment"
            name="reviewComment"
            onChange={() => {}}
            value=""
            placeholder="Enter comment describing what needs to be reviewed by the request initiator"
          />
          <Button
            content="Enter Comment and Review"
            onClick={() => setReviewRequest(false)}
          />
        </div>
      </Modal>
    </>
  );
}

// Helper Component for Info Items
// function InfoItem({
//   label,
//   value,
//   icon,
//   className,
// }: {
//   label: string;
//   value: string;
//   icon?: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//         {label}
//       </span>
//       <div className="flex items-center gap-2">
//         {icon && <span className="text-[#D2091E]">{icon}</span>}
//         <span className="text-sm font-semibold text-gray-900">{value}</span>
//       </div>
//     </div>
//   );
// }
