"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { DropdownOption } from "@/types/project-management-types";
import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  roles: DropdownOption[];
  mode?: "create" | "update";
  initialData?: {
    email: string;
    roleId: string;
    partnerId?: string;
    organizationName?: string;
  };
  projectId?: string;
};

export default function ProjectPartnerModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  initialData,
  projectId: propProjectId,
  roles,
}: AddProps) {
  const [successModal, setSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailOptions, setEmailOptions] = useState<DropdownOption[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  
  const token = getToken();
  const params = useParams();

  // Form state - matches your payload structure
  const [formData, setFormData] = useState({
    partnerId: "",
    organizationName: "",
    email: "",
    roleId: "",
    projectId: ""
  });

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      const projectId = propProjectId || (params?.id as string) || "";
      
      if (mode === "update" && initialData) {
        // Pre-fill form with existing data
        setFormData({
          partnerId: initialData.partnerId || "",
          email: initialData.email || "",
          roleId: initialData.roleId || "",
          organizationName: initialData.organizationName || "",
          projectId: projectId,
        });
      } else {
        // Reset form for create mode
        setFormData({
          partnerId: "",
          email: "",
          organizationName: "",
          roleId: "",
          projectId: projectId,
        });
      }

      // Fetch email options for dropdown (only in create mode)
      if (mode === "create") {
        fetchEmailOptions();
      }
    }
  }, [mode, initialData, propProjectId, isOpen, params]);

  // Fetch available emails for dropdown
  const fetchEmailOptions = async () => {
    setIsLoadingEmails(true);
    try {
      // This endpoint might need to be adjusted based on your API
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Email options response:", response.data);

      // Extract data based on API response structure
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      } else if (response.data?.data) {
        usersData = [response.data.data];
      }

      // Transform for dropdown - filter users with email
      const validUsers = usersData.filter((user: any) => user.email);
      const formattedOptions: DropdownOption[] = validUsers.map((user: any) => ({
        label: user.email,
        value: user.email,
      }));

      // Add default option
      const optionsWithDefault = [
        { label: "Select email address", value: "" },
        ...formattedOptions,
      ];

      setEmailOptions(optionsWithDefault);
    } catch (error: any) {
      console.error("Error fetching email options:", error);
      toast.error("Failed to load email options. Please try again.");
    } finally {
      setIsLoadingEmails(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle dropdown changes
  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.organizationName.trim()) {
      toast.error("Please enter organization name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please select an email address");
      return;
    }

    if (!formData.roleId) {
      toast.error("Please select a role");
      return;
    }

    if (!formData.projectId) {
      toast.error("Project ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload matching your example
      const payload = {
        isCreate: mode === "create",
        data: {
          partnerId: mode === "update" ? initialData?.partnerId || formData.partnerId : "",
          organizationName: formData.organizationName,
          email: formData.email,
          roleId: formData.roleId,
          projectId: formData.projectId,
        },
      };

      console.log("Submitting partner payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/partner`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      toast.success(
        `Project partner ${mode === "create" ? "added" : "updated"} successfully!`
      );

      // Reset form and close modal
      setFormData({
        partnerId: "",
        organizationName: "",
        email: "",
        roleId: "",
        projectId: formData.projectId, // Keep projectId for potential next add
      });

      onClose();
      setSuccessModal(true);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting partner:", error);

      // Detailed error logging
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
        toast.error(`Failed to ${mode === "create" ? "add" : "update"}: ${errorMessage}`);
      } else {
        toast.error(
          `Failed to ${mode === "create" ? "add" : "update"} project partner`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    onClose();
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
  };

  const modalTitle = mode === "create" 
    ? "Add Project Partner" 
    : "Edit Project Partner";
  
  const buttonText = mode === "create" 
    ? "Add Project Partner" 
    : "Update Project Partner";
  
  const successMessage = mode === "create"
    ? "Partner added successfully"
    : "Partner updated successfully";

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} maxWidth="600px">
        <Heading heading={modalTitle} className="text-center" />
        <div className="space-y-6 mt-6">
          <TextInput
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            placeholder="Enter organization name"
            label="Partner Organization Name"
            isBigger
          />

          <DropDown
            name="email"
            label="Contact Person Email Address"
            placeholder={isLoadingEmails ? "Loading emails..." : "Select email address"}
            options={emailOptions}
            value={formData.email}
            onChange={(value) => handleDropdownChange("email", value)}
            isBigger
          />

          <DropDown
            name="roleId"
            label="Role"
            placeholder="Select role"
            options={roles}
            value={formData.roleId}
            onChange={(value) => handleDropdownChange("roleId", value)}
            isBigger
          />

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              content="Cancel"
              isSecondary
              onClick={handleModalClose}
              isDisabled={isSubmitting}
            />
            <Button
              content={buttonText}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            />
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={successModal} onClose={handleSuccessClose} maxWidth="400px">
        <div className="flex justify-center text-green-500 mb-4">
          <Icon icon="simple-line-icons:check" width={64} height={64} />
        </div>
        <Heading
          heading="Success!"
          subtitle={successMessage}
          className="text-center"
        />
        <div className="mt-6 flex justify-center">
          <Button
            content="Close"
            onClick={handleSuccessClose}
          />
        </div>
      </Modal>
    </>
  );
}