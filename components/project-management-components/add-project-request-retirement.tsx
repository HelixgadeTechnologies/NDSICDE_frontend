"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import FileUploader from "@/ui/form/file-uploader";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddProjectRequestRetirement({
  isOpen,
  onClose,
}: AddProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
        <Heading heading="Retirement" className="text-center" />
        <div className="space-y-6 h-[550px] custom-scrollbar overflow-y-auto pr-5">
        <p className="text-sm primary">Add Line Items</p>
          <DropDown
            name="lineItem"
            label="Line Item"
            placeholder="---"
            options={[]}
            value=""
            onChange={() => {}}
            isBigger
          />
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
          <div className="flex justify-end items-center">
            <p className="text-sm primary cursor-pointer">Add another attachment</p>
          </div>
          <div className="flex items-center gap-6">
            <Button content="Print" isSecondary onClick={onClose} />
            <Button content="Submit for Review" onClick={() => {}} />
          </div>
        </div>
      </Modal>
    </>
  );
}
