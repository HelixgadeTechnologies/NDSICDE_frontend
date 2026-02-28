"use client";

import { useEffect, useState } from "react";
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
import InfoItem from "@/ui/info-item";
import { useParams } from "next/navigation";
import axios from "axios";
import { RequestRetirementType } from "@/types/retirement-request";
import { formatDate } from "@/utils/dates-format-utility";
import { ProjectOutputTypes } from "@/types/project-management-types";


export default function FinancialRequestModal() {
  const [rejectRequest, setRejectRequest] = useState(false);
  const [approveRequest, setApproveRequest] = useState(false);
  const [reviewRequest, setReviewRequest] = useState(false);

  // dummy stuff
  const head = [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost",
    "Total (₦)",
  ];

  // real stuff
  const params = useParams();
  const { requestId } = params;
  const [requests, setRequests] = useState<RequestRetirementType[]>([]);
  const [outputDetails, setOutputDetails] = useState<ProjectOutputTypes | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/list?type=${"request"}`,
        );
        setRequests(res.data.data);
      } catch (error) {
        console.error("Error fetching request details:", error);
      }
    };
    fetchRequests();
  }, []);

  const selectedRequest = requests.find((r) => {
    return r.requestId === requestId;
  });

  useEffect(() => {
    const fetchOutput = async () => {
      if (!selectedRequest?.outputId) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${selectedRequest.outputId}`,
        );
        setOutputDetails(res.data.data);
      } catch (error) {
        console.error("Error fetching output details:", error);
      }
    };

    if (selectedRequest?.outputId) {
      fetchOutput();
    }
  }, [selectedRequest]);

  console.log(selectedRequest);

  if (!selectedRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Request not found.</p>
      </div>
    );
  }

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
                  subtitle={`${selectedRequest.activityTitle} - Submitted on ${formatDate(selectedRequest.activityStartDate)}`}
                />
              </div>
              <div className="w-50">
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
                    value={selectedRequest.staff}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Output"
                    value={outputDetails?.outputStatement || "N/A"}
                    icon={<FileOutput className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Title"
                    value={selectedRequest.activityTitle}
                    icon={<ActivityIcon className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Budget Code"
                    value={selectedRequest.activityBudgetCode.toString()}
                    icon={<ActivityIcon className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Location(s)"
                    value={selectedRequest.activityLocation}
                    icon={<Navigation className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Start Date"
                    value={formatDate(selectedRequest.activityStartDate, "date-only")}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity End Date"
                    value={formatDate(selectedRequest.activityEndDate, "date-only")}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </div>

                <div className="mt-6">
                  <TitleAndContent
                    title="Activity Purpose/Description"
                    content={selectedRequest.activityPurposeDescription}
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
                  tableData={[``]}
                  renderRow={(row) => (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <p className="w-40 truncate">{selectedRequest.activityLineDescription}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {selectedRequest.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {selectedRequest.frequency}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ₦{selectedRequest.unitCost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₦{selectedRequest.total.toLocaleString()}
                      </td>
                    </>
                  )}
                />
                {/* grand total */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Grand Total</p>
                    <p className="text-2xl font-bold text-gray-900">₦{selectedRequest.unitCost + selectedRequest.total} </p>
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
                    value={selectedRequest.modeOfTransport}
                    icon={<BusFront className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Driver's Name"
                    value={selectedRequest.driverName}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Driver's Phone Number"
                    value={selectedRequest.driversPhoneNumber}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Vehicle Color"
                    value={selectedRequest.vehicleColor}
                    icon={<Paintbrush className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Departure Date"
                    value={formatDate(selectedRequest.departureTime, "date-only")}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Recipient's Phone Number"
                    value={selectedRequest.recipientPhoneNumber}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Route"
                    value={selectedRequest.route}
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
                  filename={selectedRequest.documentName}
                  // filesize="15.2 MB"
                  url={selectedRequest.documentURL}
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