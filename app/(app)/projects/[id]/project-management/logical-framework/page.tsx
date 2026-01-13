"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import FileUploader from "@/ui/form/file-uploader";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import TextInput from "@/ui/form/text-input";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dates-format-utility";

type LogicalFramework = {
  logicalFrameworkId: string;
  projectId: string;
  documentName: string;
  documentURL: string;
  createAt: string;
  projectName?: string;
  updateAt: string;
};

export default function ProjectLogicalFramework() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [data, setData] = useState<LogicalFramework[] | null>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isLoadingFramework, setIsLoadingFramework] = useState(false);
  const [selectedFramework, setSelectedFramework] =
    useState<LogicalFramework | null>(null);
  const [frameworkToDelete, setFrameworkToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const head = ["Document Name", "Upload Date", "Last Updated", "Actions"];
  const token = getToken() || undefined;
  const params = useParams();

  // Extract projectId from URL
  const projectId = (params?.id as string) || "";

  // form data
  const [formData, setFormData] = useState({
    documentName: "",
    documentURL: "",
  });

  // Fetch logical frameworks
  const fetchLogicalFrameworks = async () => {
    setIsLoadingTable(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/logical_frameworks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error(`Error fetching logical frameworks:`, error);
      toast.error("Failed to fetch logical frameworks");
    } finally {
      setIsLoadingTable(false);
    }
  };

  // Fetch single logical framework details
  const fetchFrameworkDetails = async (frameworkId: string) => {
    setIsLoadingFramework(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/logical_framework/${frameworkId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedFramework(response.data.data);
      setIsViewModalOpen(true);
      setActiveRowId(null); // Close the dropdown menu
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Failed to load framework: ${errorMessage}`);
      } else {
        toast.error("Failed to load framework details");
      }
    } finally {
      setIsLoadingFramework(false);
    }
  };

  // Handle view framework click
  const handleViewFramework = (frameworkId: string) => {
    fetchFrameworkDetails(frameworkId);
  };

  // automatically fetch logical frameworks
  useEffect(() => {
    fetchLogicalFrameworks();
  }, []);

  // Handle delete click - opens confirmation modal
  const handleDeleteClick = (frameworkId: string, documentName: string) => {
    setFrameworkToDelete({ id: frameworkId, name: documentName });
    setIsDeleteModalOpen(true);
    setActiveRowId(null); // Close the dropdown menu
  };

  // Delete a framework - actual deletion after confirmation
  const handleDeleteFramework = async () => {
    if (!frameworkToDelete) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/logical_framework/${frameworkToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Framework deleted successfully!");
      setIsDeleteModalOpen(false);
      setFrameworkToDelete(null);
      fetchLogicalFrameworks();
    } catch (error) {
      console.error(`Error deleting framework:`, error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Failed to delete: ${errorMessage}`);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload completion
  const handleUploadComplete = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      documentURL: url,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.documentName.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    if (!formData.documentURL) {
      toast.error("Please upload a document");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing. Please try again");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        isCreate: true,
        payload: {
          logicalFrameworkId: "",
          projectId: projectId,
          documentName: formData.documentName.trim(),
          documentURL: formData.documentURL,
        },
      };
      console.log("Submitting payload:", payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/logical_framework`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      toast.success("Logical framework uploaded successfully!");

      // Reset form
      setFormData({
        documentName: "",
        documentURL: "",
      });

      // Close modal
      setIsOpen(false);
      // Refresh the table data
      fetchLogicalFrameworks();
    } catch (error) {
      console.error("Error submitting logical framework:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Failed to upload: ${errorMessage}`);
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      } else {
        toast.error("Failed to upload logical framework");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle upload error
  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    toast.error(error);
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    setIsOpen(false);
    setFormData({
      documentName: "",
      documentURL: "",
    });
  };

  // Close view modal
  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedFramework(null);
  };

  // Close delete modal
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setFrameworkToDelete(null);
  };

  // Open document in new tab
  const handleOpenDocument = () => {
    if (selectedFramework?.documentURL) {
      window.open(selectedFramework.documentURL, "_blank");
    }
  };

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Upload Framework"
          icon="si:add-fill"
          onClick={() => setIsOpen(true)}
        />
      </div>

      <CardComponent>
        {isLoadingTable ? (
          <div className="dots mx-auto my-20">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <Table
            tableHead={head}
            tableData={data || []}
            checkbox
            idKey={"logicalFrameworkId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.documentName}</td>
                <td className="px-6">
                  {formatDate(row.createAt, "date-only") || "N/A"}
                </td>
                <td className="px-6">
                  {formatDate(row.updateAt, "relative") || "N/A"}
                </td>
                <td className="px-6 relative">
                  <Icon
                    icon={"uiw:more"}
                    width={22}
                    height={22}
                    className="cursor-pointer"
                    color="#909CAD"
                    onClick={() =>
                      setActiveRowId((prev) =>
                        prev === row.logicalFrameworkId
                          ? null
                          : row.logicalFrameworkId
                      )
                    }
                  />

                  {activeRowId === row.logicalFrameworkId && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50">
                        <ul className="text-sm">
                          <li
                            className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center"
                            onClick={() =>
                              handleViewFramework(row.logicalFrameworkId)
                            }>
                            <Icon
                              icon={
                                isLoadingFramework
                                  ? "pixel:spinner"
                                  : "hugeicons:view"
                              }
                              height={20}
                              width={20}
                              className={
                                isLoadingFramework ? "animate-spin" : ""
                              }
                            />
                            View Framework
                          </li>
                          <li
                            className="cursor-pointer hover:text-red-600 flex gap-2 p-3 items-center"
                            onClick={() =>
                              handleDeleteClick(
                                row.logicalFrameworkId,
                                row.documentName
                              )
                            }>
                            <Icon
                              icon={"pixelarticons:trash"}
                              height={20}
                              width={20}
                            />
                            Remove
                          </li>
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </td>
              </>
            )}
          />
        )}
      </CardComponent>

      {/* Upload Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} maxWidth="600px">
        <div className="space-y-8">
          <Heading
            heading="Upload Logical Framework Document"
            className="text-center"
          />

          <TextInput
            label="Document Name"
            value={formData.documentName}
            name="documentName"
            onChange={handleInputChange}
            placeholder="Enter document name"
          />

          <FileUploader
            multiple={false}
            autoUpload={true}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            token={token}
          />

          <div className="flex items-center gap-4">
            <Button
              content="Cancel"
              onClick={handleModalClose}
              isSecondary
              isDisabled={isSubmitting}
            />
            <Button
              content={isSubmitting ? "Uploading..." : "Submit"}
              onClick={handleSubmit}
              isDisabled={
                isSubmitting || !formData.documentName || !formData.documentURL
              }
              icon={isSubmitting ? "eos-icons:loading" : undefined}
            />
          </div>
        </div>
      </Modal>

      {/* View Framework Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        maxWidth="700px">
        <div className="space-y-6">
          <Heading heading="Framework Details" className="text-center" />

          {isLoadingFramework ? (
            <div className="dots mx-auto my-20">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : selectedFramework ? (
            <div className="space-y-4">
              {/* Document Name */}
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm font-medium text-gray-600">
                  Document Name
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {selectedFramework.documentName}
                </p>
              </div>

              {/* Project Name */}
              {selectedFramework.projectName && (
                <div className="border-b border-gray-200 pb-3">
                  <label className="text-sm font-medium text-gray-600">
                    Project Name
                  </label>
                  <p className="text-base text-gray-900 mt-1">
                    {selectedFramework.projectName}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                {/* Created Date */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Created Date
                  </label>
                  <p className="text-base text-gray-900 mt-1">
                    {formatDate(selectedFramework.createAt, "full")}
                  </p>
                </div>

                {/* Updated Date */}
                {selectedFramework.updateAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Last Updated
                    </label>
                    <p className="text-base text-gray-900 mt-1">
                      {formatDate(selectedFramework.updateAt, "relative")}
                    </p>
                  </div>
                )}
              </div>

              {/* Document URL */}
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm font-medium text-gray-600">
                  Document URL
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-700 truncate flex-1">
                    {selectedFramework.documentURL}
                  </p>
                  <button
                    onClick={handleOpenDocument}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap">
                    Open Document
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <Button
                  content="Open Document"
                  onClick={handleOpenDocument}
                  icon="hugeicons:file-view"
                />
                <Button
                  content="Close"
                  onClick={handleViewModalClose}
                  isSecondary
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No framework details available
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        maxWidth="500px">
        <div className="space-y-6">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Icon
                icon="heroicons:exclamation-triangle"
                className="w-8 h-8 text-red-600"
              />
            </div>
          </div>

          {/* Title */}
          <Heading
            heading="Delete Framework?"
            className="text-center text-gray-900"
          />

          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                "{frameworkToDelete?.name}"
              </strong>
              ?
            </p>
            <p className="text-sm text-red-600 font-medium">
              This action cannot be undone.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              content="Cancel"
              onClick={handleDeleteModalClose}
              isSecondary
              // isDisabled={isDeleting}
            />
            <Button
              content={isDeleting ? "Deleting..." : "Delete Framework"}
              onClick={handleDeleteFramework}
              isDisabled={isDeleting}
              icon={isDeleting ? "eos-icons:loading" : "pixelarticons:trash"}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
