"use client";

import { Activity, useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import FileDisplay from "@/ui/file-display";
import TitleAndContent from "@/components/super-admin-components/data-validation/title-content-component";
import Table from "@/ui/table";
import {
  Calendar,
  MapPin,
  User,
  Truck,
  Phone,
  FileText,
  DollarSign,
  Paintbrush,
  BusFront,
  FileOutput,
  ActivityIcon,
  Navigation,
} from "lucide-react";
import CardComponent from "@/ui/card-wrapper";
import BackButton from "@/ui/back-button";
import DeleteModal from "@/ui/generic-delete-modal";
import TextareaInput from "@/ui/form/textarea";

export default function FinancialRequestModal() {
  const [rejectRequest, setRejectRequest] = useState(false);
  const [approveRequest, setApproveRequest] = useState(false);
  const [reviewRequest, setReviewRequest] = useState(false);

  const head = ["Item Line Description", "Quantity", "Frequency", "Unit Cost", "Total (₦)"];

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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <Heading
                  heading="Financial Request"
                  subtitle="Community Health Initiative - Submitted on May 15, 2023 at 10:30"
                />
              </div>
              <div className="w-[200px]">
                <Button
                  content="Print Request"
                  isSecondary
                  onClick={() => window.print()}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Submission Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Submission Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    label="Submitted by"
                    value="John Doe"
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Output"
                    value="Output Name"
                    icon={<FileOutput className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Title"
                    value="Activity Title"
                    icon={<ActivityIcon className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Budget Code"
                    value="000000"
                    icon={<ActivityIcon className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Locations"
                    value="Location 1"
                    icon={<Navigation className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Start Date"
                    value="12/04/2025"
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity End Date"
                    value="12/04/2025"
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </div>

                <div className="mt-6">
                  <TitleAndContent
                    title="Activity Purpose/Description"
                    content="Conducted a 2-hour workshop with the client team to gather detailed requirements for the new dashboard feature. The session was highly productive with active participation from all stakeholders."
                  />
                </div>
              </div>

              {/* Budget Breakdown Card */}
              <CardComponent>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#D2091E]" />
                  Budget Breakdown
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

            {/* Right Column - Supporting Documents & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Journey Management Card */}
              <CardComponent>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Journey Management
                </h3>

                <div className="space-y-6">
                  <InfoItem
                    label="Mode of Transport"
                    value="Road"
                    icon={<BusFront className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Driver's Name"
                    value="John Doe"
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Driver's Phone Number"
                    value="09039776534"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Vehicle Color"
                    value="Red"
                    icon={<Paintbrush className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Departure Date"
                    value="12/04/2025"
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Recipient's Phone Number"
                    value="09039776534"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Route"
                    value="Some road, some street, more road"
                    icon={<MapPin className="w-4 h-4" />}
                    className="col-span-2"
                  />
                </div>
              </CardComponent>
              {/* Supporting Documents Card */}
              <CardComponent>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D2091E]" />
                  Supporting Document
                </h3>
                <FileDisplay
                  filename="progress_photos.zip"
                  filesize="15.2 MB"
                />

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <Button
                    content="Approve"
                    onClick={() => setApproveRequest(true)}
                  />
                  <Button
                    content="Review"
                    isSecondary
                    onClick={() => setReviewRequest(true)}
                  />
                  <Button
                    content="Reject"
                    isSecondary
                    onClick={() => setRejectRequest(true)}
                  />
                </div>
              </CardComponent>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <DeleteModal
        isOpen={rejectRequest}
        onClose={() => setRejectRequest(false)}
        heading="Do you want to delete this Request"
      />

      {/* Approve Modal */}
      <Modal isOpen={approveRequest} onClose={() => setApproveRequest(false)}>
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
      </Modal>

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
            content="Enter Comment"
            onClick={() => setReviewRequest(false)}
          />
        </div>
      </Modal>
    </>
  );
}

// Helper Component for Info Items
function InfoItem({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {icon && <span className="text-[#D2091E]">{icon}</span>}
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );
}
