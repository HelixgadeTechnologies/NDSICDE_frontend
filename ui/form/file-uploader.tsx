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

export default function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    const isValidType = ALLOWED_TYPES.includes(file.type);
    const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

    if (!isValidType) {
      setError("Unsupported file type. Please upload PDF, DOC, DOCX, XLS, XLSX, JPG, or PNG files.");
      return false;
    }

    if (!isValidSize) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please choose a smaller file.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
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
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

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
          ${selectedFile ? "border-green-300 bg-green-50" : ""}
        `}
      >
        {/* Upload Icon */}
        <div className={`
          flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors
          ${isDragOver ? "bg-red-100" : selectedFile ? "bg-green-100" : "bg-gray-100"}
        `}>
          <Icon 
            icon={selectedFile ? "heroicons:check-circle" : "heroicons:cloud-arrow-up"} 
            className={`w-8 h-8 ${isDragOver ? "text-red-500" : selectedFile ? "text-green-500" : "text-gray-500"}`}
          />
        </div>

        {/* Upload Text */}
        <div className="text-center space-y-2">
          <p className="text-base">
            <span className="font-semibold text-gray-900">
              {selectedFile ? "File uploaded successfully" : "Click to upload"}
            </span>
            {!selectedFile && (
              <span className="font-normal text-gray-600 ml-1">or drag and drop</span>
            )}
          </p>
          <p className="text-sm text-gray-500">
            Supports: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB per file)
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
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
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && !error && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* File Icon */}
              <div className="flex-shrink-0">
                <Icon 
                  icon={getFileIcon(selectedFile.type)} 
                  className="w-10 h-10"
                />
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {selectedFile.type.split('/')[1]?.replace('vnd.', '').replace('officedocument.', '')}
                  </span>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={removeFile}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
              title="Remove file"
            >
              <Icon icon="heroicons:x-mark" className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* Progress Bar (Optional - for future upload progress) */}
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
      )}

      {/* Upload Button (Optional)
      {selectedFile && !error && (
        <div className="mt-4 flex justify-end">
          <button className="px-6 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
            Upload File
          </button>
        </div>
      )} */}
    </div>
  );
}