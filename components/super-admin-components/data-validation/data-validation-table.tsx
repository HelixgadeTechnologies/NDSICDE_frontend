"use client";

import { Icon } from "@iconify/react";
import { ChangeEvent, useState } from "react";
import { reportDetails } from "@/lib/config/report-details";
import { DetailsType } from "@/types/report-details";
import CardComponent from "@/ui/card-wrapper";
import Modal from "@/ui/popup-modal";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import TitleAndContent from "./title-content-component";
import Button from "@/ui/form/button";
import FileDisplay from "@/ui/file-display";
import TextareaInput from "@/ui/form/textarea";
import CommentsTab from "@/ui/comments-tab";

export default function DataValidationTable() {
  const head = [
    "Submission Name/Type",
    "Project",
    "Submitted By",
    "Date Submitted",
    "Status",
    "Action",
  ];

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [details, setDetails] = useState<DetailsType | undefined>(undefined);
  const handleModalOpen = (index: number) => {
    setIsOpenModal(true);
    const selectedDetails = reportDetails.find((d) => d.id === index);
    setDetails(selectedDetails);
  };

  const [newComment, setNewComment] = useState("");
  const handleNewComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  }

  return (
    <>
      <CardComponent>
        <Table
          tableHead={head}
          tableData={reportDetails}
          checkbox
          idKey="id"
          renderRow={(row) => (
            <>
              <td className="px-6">{row.name}</td>
              <td className="px-6">{row.project}</td>
              <td className="px-6">{row.submittedBy}</td>
              <td className="px-6">{row.date}</td>
              <td className="px-6">{row.status}</td>
              <td className="px-6">
                <div className="flex gap-2">
                  <Icon
                    icon={"fluent-mdl2:view"}
                    width={16}
                    height={16}
                    onClick={() => handleModalOpen(row.id)}
                  />
                  <Icon
                    icon={"fluent-mdl2:accept"}
                    width={16}
                    height={16}
                    color="#22C55E"
                  />
                  <Icon
                    icon={"fluent-mdl2:cancel"}
                    width={16}
                    height={16}
                    color="#EF4444"
                  />
                </div>
              </td>
            </>
          )}
        />
      </CardComponent>

      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        width="40%"
        maxWidth="800px"
      >
        <div className="overflow-y-auto h-137.5 custom-scrollbar p-2.5">
          <Heading heading="Report Details" />
          <p className="text-[#8C94A6] text-sm">
            {details?.project} - Submitted on {details?.date} at {details?.time}
          </p>
          <h3 className="text-lg font-bold text-black my-2">
            Submission Details
          </h3>
          <div className="my-4">
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Submitted by:</span>
              <span className="font-semibold text-gray-900">
                {" "}
                {details?.submittedBy}
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
                            `}
              >
                {" "}
                {details?.status}
              </span>
            </p>
            <div className="space-y-4 my-3">
              {details?.submissionDetails.map((s, i) => (
                <TitleAndContent key={i} title={s.name} content={s.content} />
              ))}
            </div>

            {/* attached evidence */}
            <div className="space-y-2 my-4">
                <h3 className="text-lg font-bold text-black my-3">Attached Evidence</h3>
                {/* change to array or take from endpoint */}
                <FileDisplay filename="progress_photos.zip" filesize="15.2 MB" />
                <FileDisplay filename="financial_report.pdf" filesize="20.8 MB" />
            </div>

            {/* comments */}
            <div className="space-y-2 my-4">
                <h3 className="text-lg font-bold text-black my-3">Comments</h3>
                <div className="space-y-2">
                    {Array.isArray(details?.comments) && details.comments.length > 0 ? (
                    details.comments.map((c, i) => (
                        <CommentsTab
                        key={i}
                        name={c.commentedBy}
                        date={c.date}
                        time={c.time}
                        comment={c.comment}
                        />
                    ))
                    ) : (
                    <div className="text-sm text-gray-600 text-center mb-5">No comments yet.</div>
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
            <Button content="Reject Submission" isSecondary />
            <Button content="Approve Submission" />
          </div>
        </div>
      </Modal>
    </>
  );
}
