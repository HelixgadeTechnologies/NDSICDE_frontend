"use client";

import CardComponent from "@/ui/card-wrapper";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";
import Button from "@/ui/form/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getToken } from "@/lib/api/credentials";

type AddCommentsProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedReportId?: string | number;
};

export default function AddComment({ isOpen, onClose, selectedReportId }: AddCommentsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    indicatorReportId: selectedReportId || "",
    comment: ""
  });
  const token = getToken();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/indicator-report-comments`, formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success("Comment added successfully");
      onClose();
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px">
      <div className="flex justify-end mb-6 cursor-pointer">
        <Icon onClick={onClose} icon={"ic:round-close"} height={20} width={20} />
      </div>
      <CardComponent>
        <Heading heading="Add Comments" />
        <div className="mt-2.5">
          <TextareaInput
            value={formData.comment}
            name="comment"
            placeholder="Type your comment here"
            onChange={(e) => {
              setFormData({
                ...formData,
                comment: e.target.value
              });
            }}
            maxLength={120}
            showCharCount={true}
          />
        </div>
      </CardComponent>
      <div className="mt-6">
        <Button content="Submit" onClick={handleSubmit} isLoading={isLoading} />
      </div>
    </Modal>
  );
}
