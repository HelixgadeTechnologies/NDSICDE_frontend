"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useSearchParams } from "next/navigation";
import { useRequests } from "@/context/RequestsContext";
import { useEffect, useState } from "react";
import AddProjectRequestRetirement from "@/components/project-management-components/add-project-request-retirement";
import EditProjectRequestRetirement from "@/components/project-management-components/edit-project-request-retirement";
import FileDisplay from "@/ui/file-display";
import InfoItem from "@/ui/info-item";
import { ProjectRequestType, ProjectOutputTypes } from "@/types/project-management-types";
import { RetirementRequestType } from "@/types/retirement-request";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import {
  ActivityIcon,
  Calendar,
  FileOutput,
  Navigation,
  User,
} from "lucide-react";
import TitleAndContent from "@/components/super-admin-components/data-validation/title-content-component";
import { toast } from "react-toastify";
import DeleteModal from "@/ui/generic-delete-modal";

export default function ProjectRequestRetirementPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const { requests, fetchRetirements } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequestType | null>(null);
  const [outputDetails, setOutputDetails] = useState<ProjectOutputTypes | null>(null);
  const [requestRetirements, setRequestRetirements] = useState<RetirementRequestType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddRetirement, setOpenAddRetirement] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditRetirement, setOpenEditRetirement] = useState(false);
  const [selectedRetirement, setSelectedRetirement] = useState<RetirementRequestType | null>(null);
  useEffect(() => {
    const loadRequest = async () => {
      setIsLoading(true);
      if (!requestId) return;
      try {
        let requestDetails = requests.find((r) => r.requestId === requestId);
        if (!requestDetails) {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/${requestId}`);
            requestDetails = res.data.data;
        }
        if (requestDetails) {
            setSelectedRequest(requestDetails);
            if (requestDetails.outputId) {
                const outputRes = await axios.get(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${requestDetails.outputId}`,
                );
                setOutputDetails(outputRes.data.data);
            }

            try {
                const res = await axios.get(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/list`,
                  {
                    params: { type: "retirement" },
                  },
                );
                const allRetirements = res.data?.data || [];
                const matchingRetirements = allRetirements.filter((r: RetirementRequestType) => r.requestId === requestId);
                setRequestRetirements(matchingRetirements);
            } catch (err) {
                console.error("Failed to fetch retirements", err);
            }
        }
      } catch (error) {
        console.error("Error finding request specifics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRequest();
  }, [requestId, requests]);

  const head = [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total Budget (₦)",
    "Actual Cost (₦)",
    "Actions",
  ];

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

  if (!selectedRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Request not found.</p>
      </div>
    );
  }

  const deleteRetirement = async (retirementId: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/retirement/retirement/${retirementId}`);
      setRequestRetirements((prev) =>
        prev.filter((r) => r.retirementId !== retirementId)
      );
    } catch (error) {
      console.error(`Error deleting retirement: ${error}`);
      toast.error("Failed to delete retirement");
    } finally {
      setIsDeleting(false);
      setOpenDeleteModal(false);
      fetchRetirements();
    }
  }

  return (
    <div className="mt-12 space-y-7">
      {/* add retirement button */}
      <div className="w-50">
        <Button
          content="Retire Request"
          icon="si:add-fill"
          onClick={() => setOpenAddRetirement(true)}
        />
      </div>
      {/* submission details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          Submission Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <InfoItem
            label="Submitted by"
            value={selectedRequest.staff || "N/A"}
            icon={<User className="w-4 h-4" />}
          />
          <InfoItem
            label="Output"
            value={outputDetails?.outputStatement || "N/A"}
            icon={<FileOutput className="w-4 h-4" />}
          />
          <InfoItem
            label="Activity Title"
            value={selectedRequest.activityTitle || "N/A"}
            icon={<ActivityIcon className="w-4 h-4" />}
          />
          <InfoItem
            label="Activity Budget Code"
            value={selectedRequest.activityBudgetCode?.toString() || "N/A"}
            icon={<ActivityIcon className="w-4 h-4" />}
          />
          <InfoItem
            label="Activity Locations"
            value={selectedRequest.activityLocation || "N/A"}
            icon={<Navigation className="w-4 h-4" />}
          />
          <InfoItem
            label="Activity Start Date"
            value={selectedRequest.activityStartDate ? formatDate(selectedRequest.activityStartDate, "date-only") : "N/A"}
            icon={<Calendar className="w-4 h-4" />}
          />
          <InfoItem
            label="Activity End Date"
            value={selectedRequest.activityEndDate ? formatDate(selectedRequest.activityEndDate, "date-only") : "N/A"}
            icon={<Calendar className="w-4 h-4" />}
          />
        </div>

        <div className="mt-6">
          <TitleAndContent
            title="Activity Purpose/Description"
            content={selectedRequest.activityPurposeDescription || "N/A"}
          />
        </div>
      </div>

      {/* table */}
      <CardComponent>
        <Table
          tableHead={head}
          tableData={requestRetirements}
          checkbox
          idKey={"retirementId"}
          renderRow={(row: RetirementRequestType) => (
            <>
             <td className="px-6">{row.activityLineDescription || "N/A"}</td>
            <td className="px-6">{row.quantity || "0"}</td>
            <td className="px-6">{row.frequency || "0"}</td>
            <td className="px-6">{row.unitCost || "0"}</td>
            <td className="px-6">
              {row.totalBudget || "0"}
            </td>
            <td className="px-6">{row.actualCost || "0"}</td>
              <td className="px-6 relative">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) =>
                      prev === row.retirementId ? null : row.retirementId
                    )
                  }
                />

                {activeRowId === row.retirementId && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50">
                      <ul className="text-sm">
                        <li 
                          onClick={() => {
                            setSelectedRetirement(row);
                            setOpenEditRetirement(true);
                            setActiveRowId(null);
                          }}
                          className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"ph:pencil-simple-line"}
                            height={20}
                            width={20}
                          />
                          Edit
                        </li>
                        <li onClick={() => setOpenDeleteModal(true)} className="cursor-pointer hover:text-[--primary-light] border-y border-gray-300 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"pixelarticons:trash"}
                            height={20}
                            width={20}
                          />
                          Remove
                        </li>
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                )}
              </td>
            </>
          )}
        />
        <div className="flex justify-between items-center pt-6 px-10 text-base font-medium">
          <p>Total Activity Cost (₦): {requestRetirements.reduce((acc, curr) => acc + (curr.actualCost || 0), 0).toLocaleString()}</p>
          <p>Amount to reimburse to NDSICDE (₦): 0</p>
          <p>Amount to reimburse to Staff (₦): 0</p>
        </div>
      </CardComponent>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            Attached Documents
         </h3>
         {selectedRequest.documentURL ? (
            <FileDisplay
            filename={selectedRequest.documentName}
            url={selectedRequest.documentURL}
            />
        ) : (
            <p className="text-sm text-gray-500">No documents attached.</p>
        )}
      </div>

      {/* <div className="w-[400px] gap-6 mt-6 flex">
        <Button content="Retire Selected" isSecondary onClick={() => setOpenAddRetirement(true)} />
      </div> */}

      {openAddRetirement && <AddProjectRequestRetirement
        isOpen={openAddRetirement}
        onClose={() => setOpenAddRetirement(false)}
        selectedRequest={selectedRequest}
      />}

      {openEditRetirement && selectedRetirement && <EditProjectRequestRetirement
        isOpen={openEditRetirement}
        onClose={() => { setOpenEditRetirement(false); fetchRetirements(); }}
        selectedRequest={selectedRequest}
        retirementData={selectedRetirement}
      />}

      {openDeleteModal && <DeleteModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => deleteRetirement(activeRowId!)}
        isDeleting={isDeleting}
        heading="Delete Retirement"
        subtitle="Are you sure you want to delete this retirement?"
      />}
    </div>
  );
}
