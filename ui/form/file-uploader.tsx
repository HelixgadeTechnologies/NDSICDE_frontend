"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";

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

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

type UploadResponse = {
  url: string;
  fileName: string;
  fileType: string;
};

type FileUploaderProps = {
  onFilesChange?: (files: File[]) => void;
  onUploadComplete?: (uploadedUrl: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  multiple?: boolean;
  autoUpload?: boolean;
  uploadEndpoint?: string;
  token?: string;
  successMessageDuration?: number;
};

export default function FileUploader({
  onFilesChange,
  onUploadComplete,
  onUploadStart,
  onUploadError,
  maxFiles = 5,
  multiple = true,
  autoUpload = true,
  uploadEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload/file-upload`,
  token,
  successMessageDuration = 3000,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

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

    // Handle single file mode - replace existing files
    if (!multiple && filesArray.length > 0) {
      const file = filesArray[0];
      const error = validateFile(file);
      
      if (error) {
        setError(error);
        return;
      }
      
      setSelectedFiles([file]);
      setError(null);
      setUploadSuccess(false);
      
      if (onFilesChange) {
        onFilesChange([file]);
      }
      
      if (autoUpload) {
        uploadFiles([file]);
      }
      
      return;
    }

    // Multiple file mode
    if (selectedFiles.length + filesArray.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    filesArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
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
    setUploadSuccess(false);
    
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
    
    if (autoUpload && validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (filesToUpload: File[] = selectedFiles) => {
    if (filesToUpload.length === 0) return;
    
    setUploading(true);
    setError(null);
    setUploadSuccess(false);
    
    if (onUploadStart) {
      onUploadStart();
    }

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        try {
          const base64String = await fileToBase64(file);
          
          const payload = {
            base64String,
            mimeType: file.type,
            fileName: file.name,
          };

          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 50,
          }));

          const config = {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          };

          const response = await axios.post(uploadEndpoint, payload, config);
          
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100,
          }));

          // Extract the uploaded URL from response
          const uploadedUrl = response.data.data || response.data.url;

          return {
            url: uploadedUrl,
            fileName: file.name,
            fileType: file.type,
          };
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          throw new Error(`Failed to upload ${file.name}`);
        }
      });

      const results = await Promise.all(uploadPromises);
      
      const successfulUploads = results.filter(result => result.url);
      
      if (successfulUploads.length > 0) {
        // Show success state
        setUploadSuccess(true);
        setSuccessMessage(
          `Successfully uploaded ${successfulUploads.length} file${successfulUploads.length > 1 ? 's' : ''}!`
        );

        // Return the uploaded URL to parent (for single file, return the URL directly)
        if (onUploadComplete) {
          const uploadUrl = successfulUploads[0].url;
          onUploadComplete(uploadUrl);
        }
        
        // Clear files and success message after delay
        // setTimeout(() => {
        //   setSelectedFiles([]);
        //   setUploadProgress({});
        //   setUploadSuccess(false);
        //   setSuccessMessage("");
        // }, successMessageDuration);
      }
      
      return successfulUploads;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setError(errorMessage);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    addFiles(files);
    
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

    if (!multiple && files.length > 0) {
      const fileArray = [files[0]];
      addFiles(fileArray);
    } else {
      addFiles(files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const fileToRemove = selectedFiles[indexToRemove];
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    setError(null);
    setUploadSuccess(false);
    
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name];
      return newProgress;
    });
    
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError("No files to upload");
      return;
    }
    
    return await uploadFiles();
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    setError(null);
    setUploadSuccess(false);
    
    if (onFilesChange) {
      onFilesChange([]);
    }
  };

  const shouldBeScrollable = multiple && selectedFiles.length > 1;

  return (
    <div className="w-full">
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
            ? "border-blue-400 bg-blue-50" 
            : uploadSuccess
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-gray-500 hover:bg-gray-50"
          }
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* Upload Icon */}
        <div className={`
          flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors
          ${isDragOver ? "bg-blue-100" : uploadSuccess ? "bg-green-100" : "bg-gray-100"}
          ${uploading ? "bg-gray-200" : ""}
        `}>
          {uploading ? (
            <Icon icon="heroicons:arrow-path" className="w-8 h-8 text-gray-500 animate-spin" />
          ) : uploadSuccess ? (
            <Icon icon="heroicons:check-circle" className="w-8 h-8 text-green-500" />
          ) : (
            <Icon 
              icon="heroicons:cloud-arrow-up" 
              className={`w-8 h-8 ${isDragOver ? "text-blue-500" : "text-gray-500"}`}
            />
          )}
        </div>

        {/* Upload Text */}
        <div className="text-center space-y-2">
          <p className="text-base">
            <span className={`font-semibold ${uploadSuccess ? "text-green-700" : "text-gray-900"}`}>
              {uploading
                ? "Uploading files..."
                : uploadSuccess
                  ? "Upload Successful!"
                  : "Click to upload"
              }
            </span>
            {!uploading && !uploadSuccess && (
              <span className="font-normal text-gray-600 ml-1">or drag and drop</span>
            )}
          </p>
          {!uploadSuccess && (
            <>
              <p className="text-sm text-gray-500">
                Supports: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max {MAX_FILE_SIZE_MB}MB per file)
              </p>
              <p className="text-xs text-gray-400">
                {multiple 
                  ? `Upload up to ${maxFiles} files (${selectedFiles.length}/${maxFiles})`
                  : "Single file upload only"
                }
              </p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {/* Success Message */}
      {uploadSuccess && successMessage && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center">
            <Icon icon="heroicons:check-circle" className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
            <p className="text-sm text-green-700 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 text-red-500 mt-0.5 mr-2 shrink-0" />
            <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {/* Selected Files Preview - Only show when files are selected and not uploaded */}
      {selectedFiles.length > 0 && !error && !uploadSuccess && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Selected Files ({selectedFiles.length})
            </h3>
            {selectedFiles.length > 0 && !uploading && (
              <button
                onClick={clearAllFiles}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          
          {shouldBeScrollable ? (
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 custom-scrollbar">
              {selectedFiles.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`} 
                  className="min-w-70 max-w-70 p-4 bg-white border border-gray-200 rounded-xl shadow-sm shrink-0"
                >
                  <FileItem 
                    file={file}
                    index={index}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    removeFile={removeFile}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`} 
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
                >
                  <FileItem 
                    file={file}
                    index={index}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    removeFile={removeFile}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Button (when not auto-uploading) */}
      {!autoUpload && selectedFiles.length > 0 && !uploading && !uploadSuccess && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="heroicons:cloud-arrow-up" className="w-5 h-5 mr-2" />
            Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* Uploading Indicator */}
      {uploading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Icon icon="heroicons:arrow-path" className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
            <p className="text-sm text-blue-700">
              Uploading {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface FileItemProps {
  file: File;
  index: number;
  uploading: boolean;
  uploadProgress: Record<string, number>;
  removeFile: (index: number) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, index, uploading, uploadProgress, removeFile }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="shrink-0">
            <Icon 
              icon={getFileIcon(file.type)} 
              className="w-10 h-10"
            />
          </div>
          
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

        {!uploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFile(index);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors shrink-0 ml-2"
            title="Remove file"
          >
            <Icon icon="heroicons:x-mark" className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>
            {uploadProgress[file.name] 
              ? `${uploadProgress[file.name] === 100 ? 'Uploaded' : 'Uploading...'}` 
              : 'Ready to upload'
            }
          </span>
          <span>{uploadProgress[file.name] || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              uploadProgress[file.name] === 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${uploadProgress[file.name] || 0}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};