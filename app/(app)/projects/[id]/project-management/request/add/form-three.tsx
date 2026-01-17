"use client";

import { useState, useEffect } from "react";
import TextInput from "@/ui/form/text-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import FileUploader from "@/ui/form/file-uploader";
import { useForm } from "@/context/ProjectRequestContext";
import { getToken } from "@/lib/api/credentials";
import toast from "react-hot-toast";

type FormThreeProps = {
  onBack?: () => void;
  onNext?: () => void;
};

export default function FormThree({ onBack, onNext }: FormThreeProps) {
  const { formData, updateFormData, setActiveStep } = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const token = getToken();

  useEffect(() => {
    // If we already have a document URL in context, mark as uploaded
    if (formData.documentURL) {
      setHasUploadedFile(true);
    }
  }, [formData.documentURL]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Handle file upload completion
  const handleUploadComplete = (url: string) => {
    setIsUploading(false);
    setHasUploadedFile(true);
    updateFormData({ 
      documentURL: url,
      // Auto-fill document name if empty
      documentName: formData.documentName || "Supporting Document"
    });
    toast.success("Document uploaded successfully!");
  };

  // Handle upload error
  const handleUploadError = (error: string) => {
    setIsUploading(false);
    setHasUploadedFile(false);
    toast.error(`Upload failed: ${error}`);
  };

  // Handle upload start (to show loading state)
  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveStep(2);
    }
  };

  const handleNext = () => {
    // Validate required fields
    if (!formData.documentName.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    if (!formData.documentURL) {
      toast.error("Please upload a supporting document");
      return;
    }

    if (onNext) {
      onNext();
    } else {
      setActiveStep(4);
    }
  };

  // Check if we can proceed to next step
  const canProceed = formData.documentName && formData.documentURL;

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Supporting Documents" className="text-center" />
        
        <TextInput
          label="Document Name *"
          name="documentName"
          value={formData.documentName}
          onChange={handleInputChange}
          placeholder="Enter document name (e.g., Invoice, Receipt, Report)"
          // helperText="A descriptive name helps identify this document"
        />
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Upload Supporting Document *
          </label>
          <FileUploader
            multiple={false}
            autoUpload={true}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            token={token ?? undefined}
          />
          
          {isUploading && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-700">Uploading document...</p>
              </div>
            </div>
          )}
          
          {hasUploadedFile && !isUploading && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    Document uploaded successfully!
                  </p>
                </div>
                <a
                  href={formData.documentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Preview
                </a>
              </div>
              {formData.documentName && (
                <p className="text-xs text-green-600 mt-1 ml-7">
                  Saved as: {formData.documentName}
                </p>
              )}
            </div>
          )}
          
        </div>

        {/* Current Document Status Summary */}
        {(formData.documentName || formData.documentURL) && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Document Summary</h4>
            <div className="space-y-2">
              {formData.documentName && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Document Name:</span>
                  <span className="text-sm font-medium">{formData.documentName}</span>
                </div>
              )}
              {formData.documentURL && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-green-600">Ready for submission</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* buttons */}
        <div className="flex gap-8 items-center">
          <div className="w-2/5">
            <Button 
              isSecondary 
              content="Back" 
              onClick={handleBack}
              isDisabled={isUploading}
            />
          </div>
          <div className="w-3/5">
            <Button 
              content="Next" 
              onClick={handleNext}
              isDisabled={!canProceed || isUploading}
              isLoading={isUploading}
            />
          </div>
        </div>
      </form>
    </section>
  );
}