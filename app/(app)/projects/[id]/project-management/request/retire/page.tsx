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
import InternalMemorandum from "@/components/project-management-components/internal-memorandum";
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
import BackButton from "@/ui/back-button";
import TitleAndContent from "@/components/super-admin-components/data-validation/title-content-component";
import { toast } from "react-toastify";
import DeleteModal from "@/ui/generic-delete-modal";
import { useParams } from "next/navigation";


export default function ProjectRequestRetirementPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const viewOnly = searchParams.get("viewOnly") === "true";
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
  
  const params = useParams();
  const projectId = (params?.id as string) || "";

  const fetchLocalRetirements = async () => {
    if (!requestId) return;
    try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/retirement/retirements`,
          {
            params: {
              projectId: projectId,
            },
          }
        );
        const allRetirements = res.data?.data || [];
        const matchingRetirements = allRetirements.filter((r: RetirementRequestType) => r.requestId === requestId);
        setRequestRetirements(matchingRetirements);
    } catch (err) {
        console.error("Failed to fetch retirements", err);
    }
  };

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

            await fetchLocalRetirements();
        }
      } catch (error) {
        console.error("Error finding request specifics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRequest();
  }, [requestId, requests, projectId]);

  const head = viewOnly ? [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total Budget (₦)",
    "Actual Cost (₦)",
    "Variance (₦)",
  ] : [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total Budget (₦)",
    "Actual Cost (₦)",
    "Variance (₦)",
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

  const totalRetirementBudget = requestRetirements.reduce(
    (acc, curr) => acc + (curr.totalBudget || 0),
    0,
  );
  const totalRetirementActualCost = requestRetirements.reduce(
    (acc, curr) => acc + (curr.actualCost || 0),
    0,
  );
  const retirementVariance = totalRetirementBudget - totalRetirementActualCost;

  const reimburseToNDSICDE = retirementVariance > 0 ? retirementVariance : 0;
  const reimburseToStaff = retirementVariance < 0 ? Math.abs(retirementVariance) : 0;

  return (
    <div className="mt-12 space-y-7 pb-12">
      {/* submission details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <InternalMemorandum
          isReadOnly
          staff={selectedRequest.staff}
          requestDate={selectedRequest.requestDate || (selectedRequest.activityStartDate ? formatDate(selectedRequest.activityStartDate, "date-only") : "N/A")}
          budgetName={selectedRequest.budgetName || "N/A"}
          budgetCode={selectedRequest.activityBudgetCode?.toString() || "N/A"}
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
            value={selectedRequest.activityTitle || "N/A"}
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
             <td className="px-6">₦{(row.unitCost || 0).toLocaleString()}</td>
             <td className="px-6 font-semibold">
               ₦{(row.totalBudget || 0).toLocaleString()}
             </td>
             <td className="px-6">₦{(row.actualCost || 0).toLocaleString()}</td>
             <td className="px-6 font-medium">
               {(() => {
                 const diff = (row.totalBudget || 0) - (row.actualCost || 0);
                 if (diff < 0) {
                   return (
                     <span className="text-red-500">
                       -₦{Math.abs(diff).toLocaleString()}
                     </span>
                   );
                 } else if (diff > 0) {
                   return (
                     <span className="text-green-500">
                       +₦{diff.toLocaleString()}
                     </span>
                   );
                 } else {
                   return (
                     <span className="text-gray-500">
                       ₦0
                     </span>
                   );
                 }
               })()}
             </td>
             {!viewOnly && (
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
             )}
            </>
          )}
        />
        <div className="flex justify-between items-center pt-6 px-10 text-base font-medium">
          <p>Total Activity Cost (₦): {totalRetirementActualCost.toLocaleString()}</p>
          <p>Amount to reimburse to NDSICDE (₦): {reimburseToNDSICDE.toLocaleString()}</p>
          <p>Amount to reimburse to Staff (₦): {reimburseToStaff.toLocaleString()}</p>
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

    {/* add retirement button */}
      <div className="flex gap-3 items-center w-100 print:hidden">
        <Button content="Print Report" isSecondary onClick={() => window.print()} />
        {!viewOnly && (
          <Button
            content="Retire Request"
            icon="si:add-fill"
            onClick={() => setOpenAddRetirement(true)}
          />
        )}
      </div>

      {openAddRetirement && <AddProjectRequestRetirement
        isOpen={openAddRetirement}
        onClose={() => { setOpenAddRetirement(false); fetchLocalRetirements(); }}
        selectedRequest={selectedRequest}
      />}

      {openEditRetirement && selectedRetirement && <EditProjectRequestRetirement
        isOpen={openEditRetirement}
        onClose={() => { setOpenEditRetirement(false); fetchLocalRetirements(); }}
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
