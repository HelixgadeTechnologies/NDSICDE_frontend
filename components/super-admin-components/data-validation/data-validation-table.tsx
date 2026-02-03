"use client";

import { Icon } from "@iconify/react";
import { ChangeEvent, useEffect, useState } from "react";
import CardComponent from "@/ui/card-wrapper";
import Modal from "@/ui/popup-modal";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import TitleAndContent from "./title-content-component";
import Button from "@/ui/form/button";
import FileDisplay from "@/ui/file-display";
import TextareaInput from "@/ui/form/textarea";
import CommentsTab from "@/ui/comments-tab";
import { ProjectRequestType } from "@/types/project-management-types";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { formatDate } from "@/utils/dates-format-utility";
import { useRoleStore } from "@/store/role-store";
import toast from "react-hot-toast";

type DataValidationTableProps = {
  startDate: string;
  endDate: string;
};

export default function DataValidationTable({
  startDate,
  endDate,
}: DataValidationTableProps) {
  const head = [
    "Submission Name/Type",
    "Project",
    "Submitted By",
    "Date Submitted",
    "Status",
    "Actions",
  ];
  const [data, setData] = useState<ProjectRequestType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState<boolean>(false);
  const token = getToken();
   const { user } = useRoleStore();

   const fetchData = async () => {
     setIsLoading(true);

     const payload = {
       startDate: startDate,
       endDate: endDate,
     };

     try {
       const response = await axios.post(
         `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/data-validation/list`,
         payload,
         {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
         },
       );
       setData(response.data.data);
       console.log(response.data.data);
     } catch (error) {
       console.error("Error fetching data validation records:", error);
     } finally {
       setIsLoading(false);
     }
   };
   
  useEffect(() => {
    fetchData();
  }, []);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [details, setDetails] = useState<ProjectRequestType | undefined>(
    undefined,
  );
  const handleModalOpen = (index: string) => {
    setIsOpenModal(true);
    const selectedDetails = data.find((d) => d.requestId === index);
    setDetails(selectedDetails);
  };

  const [newComment, setNewComment] = useState("");
  const handleNewComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

const handleSubmission = async (approvalStatus: 1 | 2) => {
  if (!details || !user) return;

  if (!newComment.trim()) {
    toast.error("Please add a comment before submitting.");
    return;
  }

  setIsSubmittingApproval(true);
  try {
    const payload = {
      requestId: details.requestId,
      approvalStatus: approvalStatus,
      approvedBy: user.id,
      comment: newComment,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/approve`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);
    setIsOpenModal(false);
    setNewComment("");
    
    fetchData();
  } catch (error) {
    console.error(`Error ${approvalStatus === 1 ? 'approving' : 'rejecting'} request:`, error);
    toast.error(`Failed to ${approvalStatus === 1 ? 'approve' : 'reject'} the request.`);
  } finally {
    setIsSubmittingApproval(false);
  }
};

  return (
    <>
      <CardComponent>
        {isLoading ? (
          <div className="dots my-20 mx-auto">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <Table
            tableHead={head}
            tableData={data}
            checkbox
            idKey="requestId"
            renderRow={(row) => (
              <>
                <td className="px-6">{row.activityTitle}</td>
                <td className="px-6">{row.project?.projectName}</td>
                <td className="px-6">{row.staff}</td>
                <td className="px-6">{formatDate(row.activityStartDate)}</td>
                <td className="px-6">{row.status}</td>
                <td className="px-6">
                  <div className="flex gap-2">
                    <Icon
                      icon={"fluent-mdl2:view"}
                      width={16}
                      height={16}
                      onClick={() => handleModalOpen(row.requestId)}
                    />
                    <Icon
                      icon={"fluent-mdl2:accept"}
                      width={16}
                      height={16}
                      color="#22C55E"
                      onClick={() => handleSubmission(1)}
                    />
                    <Icon
                      icon={"fluent-mdl2:cancel"}
                      width={16}
                      height={16}
                      color="#EF4444"
                      onClick={() => handleSubmission(2)}
                    />
                  </div>
                </td>
              </>
            )}
          />
        )}
      </CardComponent>


      {/* details */}
      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        width="40%"
        maxWidth="800px">
        <div className="overflow-y-auto h-137.5 custom-scrollbar p-2.5">
          <Heading heading="Report Details" />
          <p className="text-[#8C94A6] text-sm">
            {details?.project?.projectName} - Submitted on{" "}
            {formatDate(details?.activityStartDate || "")}
          </p>
          <h3 className="text-lg font-bold text-black my-2">
            Submission Details
          </h3>
          <div className="my-4">
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Submitted by:</span>
              <span className="font-semibold text-gray-900">
                {" "}
                {details?.staff}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-[#475367]">Status:</span>
              <span
                className={`font-semibold 
                            ${
                              details?.status === "Pending"
                                ? "text-yellow-500"
                                : details?.status === "Rejected"
                                  ? "text-red-500"
                                  : "text-green-500"
                            }
                            `}>
                {" "}
                {details?.status}
              </span>
            </p>

            {/* Submission Details from API response */}
            <div className="space-y-4 my-3">
              <TitleAndContent
                title="Activity Title"
                content={details?.activityTitle || "N/A"}
              />
              <TitleAndContent
                title="Activity Purpose"
                content={details?.activityPurposeDescription || "N/A"}
              />
              <TitleAndContent
                title="Activity Line Description"
                content={details?.activityLineDescription || "N/A"}
              />
              <TitleAndContent
                title="Location"
                content={details?.activityLocation || "N/A"}
              />
              <TitleAndContent
                title="Start Date"
                content={formatDate(details?.activityStartDate || "")}
              />
              <TitleAndContent
                title="End Date"
                content={formatDate(details?.activityEndDate || "")}
              />

              {/* Financial Details */}
              <div className="grid grid-cols-2 gap-4">
                <TitleAndContent
                  title="Quantity"
                  content={details?.quantity?.toString() || "N/A"}
                />
                <TitleAndContent
                  title="Frequency"
                  content={details?.frequency?.toString() || "N/A"}
                />
                <TitleAndContent
                  title="Unit Cost"
                  content={details?.unitCost?.toString() || "N/A"}
                />
                <TitleAndContent
                  title="Budget Code"
                  content={details?.budgetCode?.toString() || "N/A"}
                />
              </div>
              <TitleAndContent
                title="Total"
                content={details?.total?.toString() || "N/A"}
              />

              {/* Transport Details (if applicable) */}
              <div className="grid grid-cols-2 gap-4">
                {details?.modeOfTransport && (
                  <TitleAndContent
                    title="Mode of Transport"
                    content={details.modeOfTransport}
                  />
                )}
                {details?.driverName && (
                  <TitleAndContent
                    title="Driver Name"
                    content={details.driverName}
                  />
                )}
                {details?.vehiclePlateNumber && (
                  <TitleAndContent
                    title="Vehicle Plate"
                    content={details.vehiclePlateNumber}
                  />
                )}
                {details?.route && (
                  <TitleAndContent title="Route" content={details.route} />
                )}
              </div>
            </div>

            {/* attached evidence */}
            <div className="space-y-2 my-4">
              <h3 className="text-lg font-bold text-black my-3">
                Attached Evidence
              </h3>
              {/* Using documentURL from API response if available */}
              {details?.documentURL ? (
                <FileDisplay
                  filename={details?.documentName || "Document"}
                  filesize="N/A"
                  url={details.documentURL}
                />
              ) : (
                <div className="text-sm text-gray-600 text-center mb-5">
                  No documents attached.
                </div>
              )}
            </div>

            {/* comments */}
            <div className="space-y-2 my-4">
              <h3 className="text-lg font-bold text-black my-3">Comments</h3>
              <div className="space-y-2">
                {/* Check if there are any approval comments in the response */}
                {details?.comment_A ||
                details?.comment_B ||
                details?.comment_C ||
                details?.comment_D ||
                details?.comment_E ? (
                  <>
                    {details?.comment_A && (
                      <CommentsTab
                        name="Approver A"
                        date={formatDate(details?.createAt || "")}
                        comment={details.comment_A}
                      />
                    )}
                    {details?.comment_B && (
                      <CommentsTab
                        name="Approver B"
                        date={formatDate(details?.createAt || "")}
                        time=""
                        comment={details.comment_B}
                      />
                    )}
                    {details?.comment_C && (
                      <CommentsTab
                        name="Approver C"
                        date={formatDate(details?.createAt || "")}
                        time=""
                        comment={details.comment_C}
                      />
                    )}
                    {details?.comment_D && (
                      <CommentsTab
                        name="Approver D"
                        date={formatDate(details?.createAt || "")}
                        time=""
                        comment={details.comment_D}
                      />
                    )}
                    {details?.comment_E && (
                      <CommentsTab
                        name="Approver E"
                        date={formatDate(details?.createAt || "")}
                        time=""
                        comment={details.comment_E}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-600 text-center mb-5">
                    No comments yet.
                  </div>
                )}
              </div>
            </div>
            <TextareaInput
              label="Add Comment"
              name="newComment"
              value={newComment}
              placeholder="Type your comment here"
              onChange={handleNewComment}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button content="Reject Submission" isLoading={isSubmittingApproval} isSecondary onClick={() => handleSubmission(2)} />
            <Button content="Approve Submission" isLoading={isSubmittingApproval} onClick={() => handleSubmission(1)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
