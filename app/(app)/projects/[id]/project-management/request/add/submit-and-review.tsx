"use client";

import TitleAndContent from "@/components/super-admin-components/data-validation/title-content-component";
import FileDisplay from "@/ui/file-display";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { RequestFormData } from "./page";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/lib/api/credentials";

type FormTwoProps = {
  formData: RequestFormData;
  onBack: () => void;
  onSubmit: () => void;
};

export default function SubmitAndReview({ formData, onBack, onSubmit }: FormTwoProps) {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const projectId = params.id as string;
  const token = getToken();
  const router = useRouter();

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        isCreate: true,
        payload: {
          requestId: crypto.randomUUID(),
          staff: formData.staff,
          outputId: formData.outputId,
          activityTitle: formData.activityTitle,
          activityBudgetCode: Number(formData.activityBudgetCode) || 0,
          activityLocation: formData.activityLocation,
          activityPurposeDescription: formData.activityPurposeDescription,
          activityStartDate: formData.activityStartDate ? new Date(formData.activityStartDate).toISOString() : new Date().toISOString(),
          activityEndDate: formData.activityEndDate ? new Date(formData.activityEndDate).toISOString() : new Date().toISOString(),
          activityLineDescription: formData.activityLineDescription,
          quantity: Number(formData.quantity) || 0,
          frequency: Number(formData.frequency) || 0,
          unitCost: Number(formData.unitCost) || 0,
          budgetCode: Number(formData.budgetCode) || 0,
          total: Number(formData.total) || 0,
          modeOfTransport: formData.modeOfTransport,
          driverName: formData.driverName,
          driversPhoneNumber: formData.driversPhoneNumber,
          vehiclePlateNumber: formData.vehiclePlateNumber,
          vehicleColor: formData.vehicleColor,
          departureTime: formData.departureTime ? new Date(formData.departureTime).toISOString() : new Date().toISOString(),
          route: formData.route,
          recipientPhoneNumber: formData.recipientPhoneNumber,
          documentName: formData.documentName,
          documentURL: formData.documentURL || "string",
          projectId: projectId,
          status: "Pending"
        }
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setTimeout(() => {
        router.push(`/projects/${projectId}/project-management/request`);
      }, 2500);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  const head = ["Activity Line Item Description","Quantity", "Frequency", "Unit Cost", "Total (₦)"];

  const data = [
    {
      description: formData.activityLineDescription || "N/A",
      quantity: Number(formData.quantity) || 0,
      frequency: Number(formData.frequency) || 0,
      unit_cost: Number(formData.unitCost) || 0,
      total: Number(formData.total) || 0,
    }
  ];

  return (
    <section>
      <form className="space-y-6 w-full" onSubmit={handleFormSubmit}>
        <Heading heading="Review & Submit" className="text-center" />

        {/* body */}
        <section className="space-y-4 my-5">
          <Heading heading="Submission Details"/>
          {/* submission details */}
          <div className="space-y-3 mb-5">
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Submitted by:</span>
              <span className="font-semibold text-gray-900"> {formData.staff || "N/A"}</span>
            </p>
            {/* <p className="mb-2 text-sm">
              <span className="text-[#475367]">Output:</span>
              <span className="font-semibold text-gray-900"> {formData.outputId || "N/A"}</span>
            </p> */}
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity Title:</span>
              <span className="font-semibold text-gray-900"> {formData.activityTitle || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity Budget Code:</span>
              <span className="font-semibold text-gray-900"> {formData.activityBudgetCode || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity Locations:</span>
              <span className="font-semibold text-gray-900"> {formData.activityLocation || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity Start Date:</span>
              <span className="font-semibold text-gray-900"> {formData.activityStartDate || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity End Date:</span>
              <span className="font-semibold text-gray-900"> {formData.activityEndDate || "N/A"}</span>
            </p>
            <TitleAndContent
              title={"Activity Purpose/Description"}
              content={formData.activityPurposeDescription || "N/A"}
            />
            <Table
              tableHead={head}
              tableData={data}
              renderRow={(row) => (
                <>
                  <td className="px-6">
                    <p className="w-4/5 truncate">{row.description}</p>
                  </td>
                  <td className="px-6">{row.quantity}</td>
                  <td className="px-6">{row.frequency}</td>
                  <td className="px-6">{row.unit_cost}</td>
                  <td className="px-6">{row.total}</td>
                </>
              )}
            />
          </div>

          <Heading heading="Journey Management" />

          <div className="space-y-3">
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Mode of Transport:</span>
              <span className="font-semibold text-gray-900"> {formData.modeOfTransport || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Driver&apos;s Name:</span>
              <span className="font-semibold text-gray-900"> {formData.driverName || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">
                Driver&apos;s Phone Number:
              </span>
              <span className="font-semibold text-gray-900"> {formData.driversPhoneNumber || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Vehicle Color:</span>
              <span className="font-semibold text-gray-900"> {formData.vehicleColor || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Departure Date:</span>
              <span className="font-semibold text-gray-900"> {formData.departureTime || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Route:</span>
              <span className="font-semibold text-gray-900"> {formData.route || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">
                Recipient&apos;s Phone Number:
              </span>
              <span className="font-semibold text-gray-900"> {formData.recipientPhoneNumber || "N/A"}</span>
            </p>
          </div>

          {/* attached evidence */}
          <div className="my-4">
            <h3 className="text-lg font-bold text-black my-3">
              Supporting Document
            </h3>
            {formData.documentName ? (
               <FileDisplay filename={formData.documentName} />
            ) : (
               <span className="font-semibold text-gray-900">No Document Uploaded</span>
            )}
          </div>
        </section>

        {/* buttons */}
        <div className="flex gap-6 items-center mt-4">
          <div className="w-2/5">
            <Button type="button" isSecondary content="Back" onClick={onBack} isDisabled={loading} />
          </div>
          <div className="w-3/5">
            <Button type="button" content={loading ? "Submitting..." : "Submit"} onClick={() => handleFormSubmit()} isDisabled={loading} />
          </div>
        </div>
      </form>
    </section>
  );
}
