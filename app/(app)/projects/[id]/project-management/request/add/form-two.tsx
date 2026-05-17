"use client";

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

export default function FormThree({ onBack, onNext, formData, updateFormData }: FormThreeProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const token = getToken();

  const handleNext = () => {
    if (!formData.documentName) {
      toast.error("Please provide a Document Name.");
      return;
    }
    if (!formData.documentURL) {
      toast.error("Please upload a supporting document.");
      return;
    }
    onNext();
  };

  const handleFileUploadComplete = (uploadedUrl: string) => {
    updateFormData({ documentURL: uploadedUrl });
  };

  const handleUploadError = (error: string) => {
    toast.error(error || "Failed to upload document.");
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Support Document" className="text-center" />
        <TextInput
          label="Document Name"
          name="documentName"
          value={formData.documentName}
          onChange={(e) => updateFormData({ documentName: e.target.value })}
        />
        <FileUploader 
          multiple={false}
          token={token || undefined}
          onUploadComplete={handleFileUploadComplete}
          onUploadError={handleUploadError}
        />

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
