"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import TextInput from "@/ui/form/text-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import FileUploader from "@/ui/form/file-uploader";
import { toast } from "react-toastify";
import { RequestFormData } from "./page";
import { getToken } from "@/lib/api/credentials";

type FormThreeProps = {
  onBack: () => void;
  onNext: () => void;
  formData: RequestFormData;
  updateFormData: (data: Partial<RequestFormData>) => void;
};

export default function FormThree({
  onBack,
  onNext,
  formData,
  updateFormData,
}: FormThreeProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const token = getToken();

  // Local fields for the entry currently being filled in — pushed to
  // formData.supportingDocuments only when the user clicks "Add".
  const [pendingName, setPendingName] = useState("");
  const [pendingUrl, setPendingUrl] = useState("");
  // Bump this when a doc is added so the FileUploader remounts and resets
  const [uploaderKey, setUploaderKey] = useState(0);

  const handleAdd = () => {
    if (!pendingName.trim()) {
      toast.error("Please provide a Document Name.");
      return;
    }
    if (!pendingUrl) {
      toast.error("Please upload a supporting document.");
      return;
    }
    updateFormData({
      supportingDocuments: [
        ...formData.supportingDocuments,
        { documentName: pendingName.trim(), documentURL: pendingUrl },
      ],
    });
    setPendingName("");
    setPendingUrl("");
    setUploaderKey((k) => k + 1);
  };

  const handleRemove = (index: number) => {
    updateFormData({
      supportingDocuments: formData.supportingDocuments.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleNext = () => {
    if (formData.supportingDocuments.length === 0) {
      toast.error("Please add at least one supporting document.");
      return;
    }
    onNext();
  };

  const handleUploadError = (error: string) => {
    toast.error(error || "Failed to upload document.");
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Support Document" className="text-center" />

        {formData.supportingDocuments.length > 0 && (
          <ul className="space-y-2">
            {formData.supportingDocuments.map((doc, index) => (
              <li
                key={`${doc.documentName}-${index}`}
                className="flex items-center justify-between gap-3 border border-gray-200 rounded-md px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.documentName}
                  </p>
                  {/* <a
                    href={doc.documentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-(--primary-light) underline truncate block">
                    {doc.documentURL}
                  </a> */}
                </div>
                <a href={doc.documentURL} target="_blank"  className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                  <Icon icon="hugeicons:view" width={21} height={21}/>
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  title="Remove document">
                  <Icon icon="pixelarticons:trash" width={20} height={20} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <TextInput
          label="Document Name"
          name="documentName"
          value={pendingName}
          onChange={(e) => setPendingName(e.target.value)}
        />
        <FileUploader
          key={uploaderKey}
          multiple={false}
          token={token || undefined}
          onUploadComplete={setPendingUrl}
          onUploadError={handleUploadError}
        />

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 text-sm font-semibold text-(--primary-light) hover:underline">
          <Icon icon="si:add-fill" width={16} height={16} />
          Add
        </button>

        {/* buttons */}
        <div className="flex gap-8 items-center mt-5">
          <div className="w-2/5">
            <Button isSecondary content="Back" onClick={onBack} />
          </div>
          <div className="w-3/5">
            <Button content="Next" onClick={handleNext} />
          </div>
        </div>
      </form>
    </section>
  );
}
