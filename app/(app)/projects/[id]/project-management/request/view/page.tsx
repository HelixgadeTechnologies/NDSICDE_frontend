"use client";

import { useEffect, useState } from "react";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import FileDisplay from "@/ui/file-display";
import TitleAndContent from "@/components/super-admin-components/data-validation/title-content-component";
import Table from "@/ui/table";
import Button from "@/ui/form/button";
import BackButton from "@/ui/back-button";
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
import { ProjectRequestResponseType, RequestLineItemType } from "@/types/project-management-types";
import { useSearchParams } from "next/navigation";
import InternalMemorandum from "@/components/project-management-components/internal-memorandum";

export default function ViewActivityRequestPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [requestDetails, setRequestDetails] = useState<ProjectRequestResponseType | null>(null);
  const [outputDetails, setOutputDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = getToken();

  const head = [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
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
    fetchDetails();
  }, [requestId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="dots my-20 mx-auto">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Request not found.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-7 pb-12">
      <div className="flex justify-between items-center">
        <Heading
          heading="Financial Request Details"
          subtitle={`${requestDetails.activityTitle || "N/A"} - Submitted on ${formatDate(requestDetails.activityStartDate)}`}
        />
        <div className="print:hidden">
          <Button content="Print Request" isSecondary onClick={() => window.print()} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left column: Submission Details & Budget breakdown */}
        <div className="lg:col-span-2 space-y-7">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <InternalMemorandum
                isReadOnly
                staff={requestDetails.staff}
                requestDate={requestDetails.requestDate || formatDate(requestDetails.activityStartDate, "date-only")}
                budgetName={requestDetails.project?.projectName || "N/A"}
                budgetCode={requestDetails.activityBudgetCode?.toString() || "N/A"}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                Activity Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <CardComponent>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D2091E]" />
              Budget Breakdown
            </h3>
            <Table
              tableHead={head}
              tableData={requestDetails.lineItems || []}
              renderRow={(row: RequestLineItemType) => (
                <>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <p className="w-40 truncate">{row.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.frequency}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₦{row.unitCost?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₦{row.totalBudget?.toLocaleString() || 0}
                  </td>
                </>
              )}
            />
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600">Grand Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(requestDetails.lineItems || [])
                    .reduce((sum, item) => sum + (item.totalBudget || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardComponent>
        </div>

        {/* Right column: Journey Management & Document attachment */}
        <div className="space-y-7">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              Journey Management
            </h3>
            {!!requestDetails.isJourneyManagementRequired ? (
              <div className="grid grid-cols-1 gap-6">
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
                {/* <InfoItem
                  label="Recipient's Phone Number"
                  value={requestDetails.recipientPhoneNumber}
                  icon={<Phone className="w-4 h-4" />}
                /> */}
                <InfoItem
                  label="Route"
                  value={requestDetails.route}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Journey management was omitted for this request.</p>
            )}
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
  );
}
