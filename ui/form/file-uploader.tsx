"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

const MAX_FILE_SIZE_MB = 10;

// File type icons mapping
const getFileIcon = (fileType: string) => {
  if (fileType === "application/pdf") return "vscode-icons:file-type-pdf2";
  if (fileType.includes("word") || fileType.includes("document")) return "vscode-icons:file-type-word";
  if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "vscode-icons:file-type-excel";
  if (fileType.includes("image")) return "vscode-icons:file-type-image";
  return "vscode-icons:default-file";
};

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

type FileUploaderProps = {
  onFilesChange?: (files: File[]) => void;
  maxFiles?: number;
};

export default function FileUploader({ onFilesChange, maxFiles = 5 }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    const isValidType = ALLOWED_TYPES.includes(file.type);
    const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

    if (!isValidType) {
      return "Unsupported file type. Please upload PDF, DOC, DOCX, XLS, XLSX, JPG, or PNG files.";
    }

    if (!isValidSize) {
      return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please choose a smaller file.`;
    }

    return null;
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const filesArray = Array.from(newFiles);
    const errors: string[] = [];
    const validFiles: File[] = [];

    // Check if adding these files would exceed maxFiles
    if (selectedFiles.length + filesArray.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    // Validate each file
    filesArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        // Check for duplicates
        const isDuplicate = selectedFiles.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size
        );
        if (!isDuplicate) {
          validFiles.push(file);
        }
      }
    });

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    const updatedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(updatedFiles);
    setError(null);
    
    // Callback to parent component
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    addFiles(files);
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    addFiles(files);
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    setError(null);
    
    // Callback to parent component
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  // const handleSubmit = () => {
  //   // Return files as array (even if it's just one file)
  //   console.log("Submitting files:", selectedFiles);
    
  //   // You can call a parent callback here
  //   if (onFilesChange) {
  //     onFilesChange(selectedFiles);
  //   }
    
  //   // Or return the array for form submission
  //   return selectedFiles;
  // };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col justify-center items-center 
          border-2 border-dashed rounded-xl h-56 px-6 py-8
          cursor-pointer transition-all duration-200 ease-in-out
          ${isDragOver 
            ? "border-red-400 bg-red-50" 
            : "border-gray-300 hover:border-gray-500 hover:bg-red-25"
          }
          ${selectedFiles.length > 0 ? "border-green-300 bg-green-50" : ""}
        `}
      >
        {/* Upload Icon */}
        <div className={`
          flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors
          ${isDragOver ? "bg-red-100" : selectedFiles.length > 0 ? "bg-green-100" : "bg-gray-100"}
        `}>
          <Icon 
            icon={selectedFiles.length > 0 ? "heroicons:check-circle" : "heroicons:cloud-arrow-up"} 
            className={`w-8 h-8 ${isDragOver ? "text-red-500" : selectedFiles.length > 0 ? "text-green-500" : "text-gray-500"}`}
          />
        </div>

        {/* Upload Text */}
        <div className="text-center space-y-2">
          <p className="text-base">
            <span className="font-semibold text-gray-900">
              {selectedFiles.length > 0 
                ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} uploaded` 
                : "Click to upload"}
            </span>
            {selectedFiles.length === 0 && (
              <span className="font-normal text-gray-600 ml-1">or drag and drop</span>
            )}
          </p>
          <p className="text-sm text-gray-500">
            Supports: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB per file)
          </p>
          <p className="text-xs text-gray-400">
            Upload up to {maxFiles} files ({selectedFiles.length}/{maxFiles})
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && !error && (
        <div className="mt-4 space-y-2 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {selectedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm w-[250px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    <Icon 
                      icon={getFileIcon(file.type)} 
                      className="w-10 h-10"
                    />
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 capitalize truncate">
                        {file.type.split('/')[1]?.replace('vnd.', '').replace('officedocument.', '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
                  title="Remove file"
                >
                  <Icon icon="heroicons:x-mark" className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Ready to upload</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button Example */}
      {/* {selectedFiles.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Submit {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
          </button>
        </div>
      )} */}
    </div>
  );
}