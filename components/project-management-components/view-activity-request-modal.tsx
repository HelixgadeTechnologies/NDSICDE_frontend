"use client";

import { useEffect, useState } from "react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
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
import InfoItem from "@/ui/info-item";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import { getToken } from "@/lib/api/credentials";

type ViewActivityRequestProps = {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
};

export default function ViewActivityRequestModal({ isOpen, onClose, requestId }: ViewActivityRequestProps) {
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [outputDetails, setOutputDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = getToken();

  const head = [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost",
    "Total (₦)",
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      if (!requestId) return;
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/${requestId}`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;
        setRequestDetails(data);
        
        if (data.outputId) {
            const outputRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${data.outputId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOutputDetails(outputRes.data.data);
        }

      } catch (error) {
        console.error("Error fetching request details", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) {
      fetchDetails();
    } else {
        setRequestDetails(null);
        setOutputDetails(null);
    }
  }, [isOpen, requestId, token]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="1000px">
      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <div className="dots my-20 mx-auto">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : requestDetails ? (
        <div className="h-[65vh] custom-scrollbar overflow-y-auto pr-2 space-y-6">
          <Heading
            heading="Financial Request Details"
            subtitle={`${requestDetails.activityTitle} - Submitted on ${formatDate(requestDetails.activityStartDate)}`}
          />

          <div className="space-y-6">
             {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Submission Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    label="Submitted by"
                    value={requestDetails.staff}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Output"
                    value={outputDetails?.outputStatement || "N/A"}
                    icon={<FileOutput className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Title"
                    value={requestDetails.activityTitle}
                    icon={<ActivityIcon className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Budget Code"
                    value={requestDetails.activityBudgetCode?.toString() || "N/A"}
                    icon={<ActivityIcon className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Location(s)"
                    value={requestDetails.activityLocation}
                    icon={<Navigation className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Start Date"
                    value={formatDate(requestDetails.activityStartDate, "date-only")}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity End Date"
                    value={formatDate(requestDetails.activityEndDate, "date-only")}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </div>

                <div className="mt-6">
                  <TitleAndContent
                    title="Activity Purpose/Description"
                    content={requestDetails.activityPurposeDescription}
                  />
                </div>
              </div>

              {/* Budget Breakdown Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                        <p className="w-40 truncate">{requestDetails.activityLineDescription}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {requestDetails.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {requestDetails.frequency}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ₦{requestDetails.unitCost?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₦{requestDetails.total?.toLocaleString() || 0}
                      </td>
                    </>
                  )}
                />
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Grand Total</p>
                    <p className="text-2xl font-bold text-gray-900">₦{requestDetails.total?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

            </div>

             {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Journey Management
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem
                    label="Mode of Transport"
                    value={requestDetails.modeOfTransport}
                    icon={<BusFront className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Driver's Name"
                    value={requestDetails.driverName}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Driver's Phone Number"
                    value={requestDetails.driversPhoneNumber}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Vehicle Color"
                    value={requestDetails.vehicleColor}
                    icon={<Paintbrush className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Departure Date"
                    value={formatDate(requestDetails.departureTime, "date-only")}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Recipient's Phone Number"
                    value={requestDetails.recipientPhoneNumber}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Route"
                    value={requestDetails.route}
                    icon={<MapPin className="w-4 h-4" />}
                    className="col-span-2"
                  />
                </div>
              </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D2091E]" />
                  Supporting Document
                </h3>
                {requestDetails.documentURL ? (
                    <FileDisplay
                    filename={requestDetails.documentName}
                    url={requestDetails.documentURL}
                    />
                ) : (
                    <p className="text-sm text-gray-500">No document attached.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-20">
          <p className="text-gray-500">Failed to load request details.</p>
        </div>
      )}
    </Modal>
  );
}
