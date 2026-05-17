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
import { useProjects } from "@/context/ProjectsContext";
import InternalMemorandum from "@/components/project-management-components/internal-memorandum";

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
  const { projects } = useProjects();
  const currentProject = projects.find((p) => p.projectId === projectId);
  const projectName = currentProject?.projectName || "N/A";

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
          activityBudgetCode: isNaN(Number(formData.activityBudgetCode)) || formData.activityBudgetCode === ""
            ? formData.activityBudgetCode
            : Number(formData.activityBudgetCode),
          budgetName: formData.budgetName || "",
          requestDate: formData.requestDate || "",
          activityLocation: formData.activityLocation,
          activityPurposeDescription: formData.activityPurposeDescription,
          activityStartDate: formData.activityStartDate
            ? new Date(formData.activityStartDate).toISOString()
            : new Date().toISOString(),
          activityEndDate: formData.activityEndDate
            ? new Date(formData.activityEndDate).toISOString()
            : new Date().toISOString(),
          budgetCode: isNaN(Number(formData.activityBudgetCode)) || formData.activityBudgetCode === ""
            ? formData.activityBudgetCode
            : Number(formData.activityBudgetCode),
          modeOfTransport: formData.modeOfTransport,
          driverName: formData.driverName,
          driversPhoneNumber: formData.driversPhoneNumber,
          vehiclePlateNumber: formData.vehiclePlateNumber,
          vehicleColor: formData.vehicleColor,
          departureTime: formData.departureDate
            ? new Date(formData.departureDate).toISOString()
            : new Date().toISOString(),
          route: formData.route,
          recipientPhoneNumber: formData.recipientPhoneNumber,
          // New fields in payload
          purposeOfTrip: formData.purposeOfTrip,
          vehicleMake: formData.vehicleMake,
          vehicleModel: formData.vehicleModel,
          otherPersonnel: formData.otherPersonnel,
          departureDate: formData.departureDate,
          departureLocationAndTime: formData.departureLocationAndTime,
          destination: formData.destination,
          contactPersonPhoneNumberAtDestination: formData.contactPersonPhoneNumberAtDestination,
          flightDepartureState: formData.flightDepartureState,
          flightDepartureTime: formData.flightDepartureTime,
          flightArrivalState: formData.flightArrivalState,
          flightArrivalTime: formData.flightArrivalTime,
          hotelAccommodationName: formData.hotelAccommodationName,
          hotelAddress: formData.hotelAddress,
          returnDate: formData.returnDate,
          returnTime: formData.returnTime,
          airportDropoffOfficerName: formData.airportDropoffOfficerName,
          airportPickupOfficerName: formData.airportPickupOfficerName,
          documentName: formData.documentName,
          documentURL: formData.documentURL || "string",
          projectId: projectId,
          createdBy: formData.createdBy,
          status: "Pending",
          lineItems: formData.budgetLineItems?.map((item) => ({
            description: item.activityLineDescription,
            quantity: Number(item.quantity) || 0,
            frequency: Number(item.frequency) || 0,
            unitCost: Number(item.unitCost) || 0,
            totalBudget: Number(item.total) || 0,
            activityId: formData.activityId,
          })),
        },
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

  const data = formData.budgetLineItems?.map(item => ({
    description: item.activityLineDescription || "N/A",
    quantity: Number(item.quantity) || 0,
    frequency: Number(item.frequency) || 0,
    unit_cost: Number(item.unitCost) || 0,
    total: Number(item.total) || 0,
  })) || [];

  return (
    <section>
      <form className="space-y-6 w-full" onSubmit={handleFormSubmit}>
        <Heading heading="Review & Submit" className="text-center" />

        {/* body */}
        <section className="space-y-4 my-5">
          <InternalMemorandum
            isReadOnly
            staff={formData.staff}
            requestDate={formData.requestDate}
            budgetName={formData.budgetName}
            budgetCode={formData.activityBudgetCode}
          />

          <div className="space-y-3 mb-5 border-t border-gray-100 pt-4">
            <p className="mb-2 text-sm">
              <span className="text-[#475367] font-medium">Activity Title:</span>
              <span className="font-semibold text-gray-900"> {formData.activityTitle || "N/A"}</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367] font-medium">Activity Locations:</span>
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
                  <td className="px-6 py-2">
                    <p className="w-4/5 truncate">{row.description}</p>
                  </td>
                  <td className="px-6 py-2">{row.quantity}</td>
                  <td className="px-6 py-2">{row.frequency}</td>
                  <td className="px-6 py-2">{row.unit_cost}</td>
                  <td className="px-6 py-2">{row.total}</td>
                </>
              )}
            />
            <div className="flex justify-end pt-2">
              <div className="text-right">
                <span className="text-sm text-gray-500 mr-3">Overall Total:</span>
                <span className="text-lg font-bold text-gray-900">
                  ₦ {formData.budgetLineItems?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          <Heading heading="Journey Management" className="border-t border-gray-100 pt-4" />

          <div className="space-y-4">
            <p className="text-sm">
              <span className="text-[#475367] font-medium">Purpose of Trip:</span>
              <span className="font-semibold text-gray-900 block mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100 whitespace-pre-wrap">{formData.purposeOfTrip || "N/A"}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-sm">
                <span className="text-[#475367] font-medium">Mode of Transport:</span>
                <span className="font-semibold text-gray-900 block mt-1">{formData.modeOfTransport || "N/A"}</span>
              </p>
            </div>

            {/* Travel Details Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#D2091E] border-b border-gray-50 pb-1">Travel Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <p className="text-sm">
                  <span className="text-[#475367] font-medium">Departure Date:</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{formData.departureDate || "N/A"}</span>
                </p>
                <p className="text-sm">
                  <span className="text-[#475367] font-medium">Departure Location & Time:</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{formData.departureLocationAndTime || "N/A"}</span>
                </p>
                <p className="text-sm">
                  <span className="text-[#475367] font-medium">Destination:</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{formData.destination || "N/A"}</span>
                </p>
                <p className="text-sm">
                  <span className="text-[#475367] font-medium">Contact Person Phone Number:</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{formData.contactPersonPhoneNumberAtDestination || "N/A"}</span>
                </p>
                <p className="text-sm md:col-span-2">
                  <span className="text-[#475367] font-medium">Intended Route:</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{formData.route || "N/A"}</span>
                </p>
              </div>
            </div>

            {/* Driver & Vehicle Details (Only if Road) */}
            {formData.modeOfTransport === "Road" && (
              <>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#D2091E] border-b border-gray-50 pb-1">Driver Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <p className="text-sm">
                      <span className="text-[#475367] font-medium">Driver&apos;s Name:</span>
                      <span className="font-semibold text-gray-900 block mt-0.5">{formData.driverName || "N/A"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[#475367] font-medium">Driver&apos;s Phone Number:</span>
                      <span className="font-semibold text-gray-900 block mt-0.5">{formData.driversPhoneNumber || "N/A"}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#D2091E] border-b border-gray-50 pb-1">Vehicle Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <p className="text-sm">
                      <span className="text-[#475367] font-medium">Vehicle Make:</span>
                      <span className="font-semibold text-gray-900 block mt-0.5">{formData.vehicleMake || "N/A"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[#475367] font-medium">Vehicle Model:</span>
                      <span className="font-semibold text-gray-900 block mt-0.5">{formData.vehicleModel || "N/A"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[#475367] font-medium">Registration Number:</span>
                      <span className="font-semibold text-gray-900 block mt-0.5">{formData.vehiclePlateNumber || "N/A"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[#475367] font-medium">Vehicle Color:</span>
                      <span className="font-semibold text-gray-900 block mt-0.5">{formData.vehicleColor || "N/A"}</span>
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Flight Details (Only if Flight) */}
            {formData.modeOfTransport === "Flight" && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#D2091E] border-b border-gray-50 pb-1">Flight Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <p className="text-sm">
                    <span className="text-[#475367] font-medium">Departure State:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.flightDepartureState || "N/A"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-[#475367] font-medium">Departure Time:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.flightDepartureTime || "N/A"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-[#475367] font-medium">Arrival State:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.flightArrivalState || "N/A"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-[#475367] font-medium">Arrival Time:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.flightArrivalTime || "N/A"}</span>
                  </p>
                  <p className="text-sm md:col-span-2">
                    <span className="text-[#475367] font-medium">Hotel Accommodation Name:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.hotelAccommodationName || "N/A"}</span>
                  </p>
                  <p className="text-sm md:col-span-2">
                    <span className="text-[#475367] font-medium">Address of Hotel:</span>
                    <span className="font-semibold text-gray-900 block mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100 whitespace-pre-wrap">{formData.hotelAddress || "N/A"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-[#475367] font-medium">Return Date:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.returnDate || "N/A"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-[#475367] font-medium">Return Time:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.returnTime || "N/A"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-[#475367] font-medium">Airport Drop-off Officer:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.airportDropoffOfficerName || "N/A"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-[#475367] font-medium">Airport Pick-up Officer:</span>
                    <span className="font-semibold text-gray-900 block mt-0.5">{formData.airportPickupOfficerName || "N/A"}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Other Personnel Travelling (Only if present) */}
            {formData.otherPersonnel && formData.otherPersonnel.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#D2091E] border-b border-gray-50 pb-1">Other Personnel Travelling</h4>
                <div className="space-y-2">
                  {formData.otherPersonnel.map((person, idx) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-4 text-sm justify-between">
                      <p className="text-sm">
                        <span className="text-[#475367] font-medium">Name:</span>
                        <span className="font-semibold text-gray-900 ml-1">{person.name || "N/A"}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-[#475367] font-medium">Company:</span>
                        <span className="font-semibold text-gray-900 ml-1">{person.company || "N/A"}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-[#475367] font-medium">Phone:</span>
                        <span className="font-semibold text-gray-900 ml-1">{person.phoneNumber || "N/A"}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
