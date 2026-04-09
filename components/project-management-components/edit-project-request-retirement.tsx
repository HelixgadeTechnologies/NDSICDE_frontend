"use client";

import Button from "@/ui/form/button";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import { ProjectRequestType } from "@/types/project-management-types";
import { RetirementRequestType } from "@/types/retirement-request";
import { getToken } from "@/lib/api/credentials";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest?: ProjectRequestType;
  retirementData: RetirementRequestType;
};

type LineItem = {
  id: number;
  value: string;
}

type LineItemProps = {
  lineItem: LineItem;
  index: number;
  onRemove: (id: number) => void;
  onChange: (id: number, field: keyof LineItem, value: string) => void;
  showRemove: boolean;
};

function LineItemInput({ onRemove, showRemove, lineItem, onChange }: LineItemProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1"> 
        <TextInput  
          name="lineItem"
          label="Line Item"
          placeholder="---"
          value={lineItem.value}
          onChange={(e: any) => onChange(lineItem.id, "value", e.target.value)}
          isBigger
        />
      </div>
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(lineItem.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors mb-4"
            title="Remove line item">
            <Icon icon="material-symbols:close-rounded" height={20} width={20} />
          </button>
        )}
    </div>
  );
}

export default function EditProjectRequestRetirement({
  isOpen,
  onClose,
  selectedRequest,
  retirementData
}: EditProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [actualCost, setActualCost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = getToken();

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, value: "" }
  ]);

  useEffect(() => {
    if (retirementData) {
      // API might not strictly have lineItem in the type or it's named something else
      const existingLineItemString = (retirementData as any).lineItem || (retirementData as any).activityLineDescription || "";
      const parsedLineItems = existingLineItemString.split(",").map((item: string, index: number) => ({ id: index + 1, value: item.trim() })).filter((item: LineItem) => item.value !== "");
      
      if (parsedLineItems.length > 0) {
        setLineItems(parsedLineItems);
      }
      
      setActualCost(retirementData.actualCost?.toString() || "");
    }
  }, [retirementData]);

  // add line item
  const addLineItem = () => {
    const newId = Math.max(...lineItems.map((l) => l.id), 0) + 1;
    setLineItems([
      ...lineItems,
      {
        id: newId,
        value: "",
      }
    ])
  };

   const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter((lineItem) => lineItem.id !== id));
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string) => {
    setLineItems(
      lineItems.map((lineItem) =>
        lineItem.id === id ? { ...lineItem, [field]: value } : lineItem
      )
    );
  };

  const submitRetirement = async () => {
    if (!retirementData) {
      toast.error("No retirement data found.");
      return;
    }
    
    setIsSubmitting(true);
    
    const combinedLineItems = lineItems.map(l => l.value).filter(Boolean).join(", ") || "0";
    const numericCost = Number(actualCost) || 0;

    const payload = {
      isCreate: false,
      payload: {
        retirementId: retirementData.retirementId,
        activityLineDescription: selectedRequest?.activityLineDescription || retirementData.activityLineDescription || "string",
        lineItem: combinedLineItems,
        quantity: selectedRequest?.quantity || retirementData.quantity || 0,
        frequency: selectedRequest?.frequency || retirementData.frequency || 0,
        unitCost: selectedRequest?.unitCost || retirementData.unitCost || 0,
        actualCost: numericCost,
        totalBudget: selectedRequest?.total || retirementData.totalBudget || 0,
        actualCostOfLineItem: numericCost,
        documentName: selectedRequest?.documentName || retirementData.documentName || "string",
        documentURL: selectedRequest?.documentURL || retirementData.documentURL || "string",
        requestId: selectedRequest?.requestId || retirementData.requestId,
        status: retirementData.retirementStatus || "Pending"
      }
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/retirement/retirement`, payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (projectId) {
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update retirement request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px">
        <Heading heading="Edit Retirement" className="text-center" />
        <div className="space-y-6 h-[350px] custom-scrollbar overflow-y-auto px-2">
          <button onClick={addLineItem} className="text-sm primary">Add Line Items</button>
          {lineItems.map((lineItem, index) => (
              <LineItemInput
              key={lineItem.id}
              index={index}
              lineItem={lineItem}
              onChange={updateLineItem}
              onRemove={removeLineItem}
              showRemove={lineItems.length > 1}
              />
          ))}
          <TextInput
            name="actualCost"
            value={actualCost}
            onChange={(e: any) => setActualCost(e.target.value)}
            placeholder="---"
            label="Actual Cost of Line Item (₦)"
            isBigger
          />
          <div className="flex items-center gap-6">
            <Button content="Close" isSecondary onClick={onClose} />
            <Button content={isSubmitting ? "Submitting..." : "Update Request"} onClick={submitRetirement} isDisabled={isSubmitting} />
          </div>
        </div>
      </Modal>
    </>
  );
}
