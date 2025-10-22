"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import FileUploader from "@/ui/form/file-uploader";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import { useState } from "react";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
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

function LineItemDropdown({ onRemove, showRemove, lineItem }: LineItemProps) {
  return (
    <div className="flex items-end gap-2">
      <DropDown
        name="lineItem"
        label="Line Item"
        placeholder="---"
        options={[]}
        value=""
        onChange={() => {}}
        isBigger
        />
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

export default function AddProjectRequestRetirement({
  isOpen,
  onClose,
}: AddProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, value: "" }
  ]);

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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
        <Heading heading="Retirement" className="text-center" />
        <div className="space-y-6 h-[550px] custom-scrollbar overflow-y-auto pr-5">
          <button onClick={addLineItem} className="text-sm primary">Add Line Items</button>
          {lineItems.map((lineItem, index) => (
            <LineItemDropdown
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
            value=""
            onChange={() => {}}
            placeholder="---"
            label="Actual Cost of Line Item (₦)"
            isBigger
          />
          <div className="space-y-1">
            <p className="font-medium text-sm text-gray-900">
              Attach vendors’ receipts (this should allow multiple attachments)
              contract etc. (Pdf, JPEG)
            </p>
            <FileUploader />
          </div>
          <TextInput
            name="name"
            value=""
            onChange={() => {}}
            placeholder="Jon Doe"
            label="Enter Name"
            isBigger
          />
          {/* <div className="flex justify-end items-center">
            <p className="text-sm primary cursor-pointer">Add another attachment</p>
          </div> */}
          <div className="flex items-center gap-6">
            <Button content="Print" isSecondary onClick={onClose} />
            <Button content="Submit for Review" onClick={() => {}} />
          </div>
        </div>
      </Modal>
    </>
  );
}
