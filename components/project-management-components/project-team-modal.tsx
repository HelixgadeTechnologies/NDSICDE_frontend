"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { DropdownOption } from "@/types/project-management-types";
import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
  roles: DropdownOption[];
  mode?: "create" | "update";
  initialData?: {
    id?: string;
    email: string;
    roleId: string;
    teamMemberId?: string;
  };
  projectId?: string;
  onSuccess?: () => void;
};

export default function ProjectTeamModal({
  isOpen,
  onClose,
  roles,
  mode = "create",
  initialData,
  projectId: propProjectId,
  onSuccess,
}: AddProps) {
  const [successModal, setSuccessModal] = useState(false);
  const token = getToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [team, setTeam] = useState<any[]>([]);
  const [teamOptions, setTeamOptions] = useState<DropdownOption[]>([]);

  // Extract project ID from URL or props
  const params = useParams();
  const [formData, setFormData] = useState({
    teamMemberId: "",
    email: "",
    roleId: "",
    projectId: "",
  });

  // Initialize form data based on mode
  useEffect(() => {
    if (!isOpen) return; // Only run when modal is open
    
    const projectId = propProjectId || (params?.id as string) || "";
    
    if (mode === "update" && initialData) {
      setFormData({
        teamMemberId: initialData.teamMemberId || "",
        email: initialData.email || "",
        roleId: initialData.roleId || "",
        projectId: projectId,
      });
    } else {
      // Reset form for create mode
      setFormData({
        teamMemberId: "",
        email: "",
        roleId: "",
        projectId: projectId,
      });
    }
  }, [mode, initialData, propProjectId, isOpen, params]);

  // Get all team members
  useEffect(() => {
    const getTeamMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("Team members response:", response.data);
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setTeam(response.data.data);

          // Format team data for dropdown
          const formattedOptions = response.data.data
            .filter((member: any) => member.email && member.userId) // Only include members with email and userId
            .map((member: any) => ({
              label: member.email,
              value: member.email,
            }));
          
          // Add a default option
          const optionsWithDefault = [
            { label: "Select a team member", value: "" },
            ...formattedOptions,
          ];
          
          setTeamOptions(optionsWithDefault);
        }
      } catch (error) {
        console.error("Error getting team members:", error);
        toast.error("Failed to load team members");
      }
    };
    
    if (isOpen && mode === "create") {
      getTeamMembers();
    }
  }, [isOpen, mode, token]);

  // Submit form
  const handleSubmit = async () => {
    // Validation
    if (!formData.email) {
      toast.error("Please select a team member");
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

    const payload = {
      isCreate: mode === "create",
      data: {
        teamMemberId: formData.teamMemberId,
        email: formData.email,
        roleId: formData.roleId,
        projectId: formData.projectId,
      },
    };
    
    console.log("Submitting payload:", payload);
    
    setIsSubmitting(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/team-member`;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", response.data);
      
      toast.success(
        `Team member ${mode === "create" ? "added" : "updated"} successfully!`
      );
      
      onClose();
      setSuccessModal(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(`Error ${mode === "create" ? "submitting" : "updating"}:`, error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Failed to ${mode === "create" ? "add" : "update"} team member: ${errorMessage}`);
      } else {
        toast.error(`Failed to ${mode === "create" ? "add" : "update"} team member`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dropdown changes - KEPT THE SAME
  const handleSelectChange = (name: string, value: string) => {
    console.log(`Dropdown ${name} changed to:`, value);
    
    // Special handling for email selection
    if (name === "email" && team && Array.isArray(team)) {
      const selectedMember = team.find((member: any) => member.email === value);

      if (selectedMember) {
        setFormData((prev) => ({
          ...prev,
          email: value,
          teamMemberId: selectedMember.userId,
        }));
        return;
      }
    }

    // Default handling for other fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
  };

  const handleModalClose = () => {
    onClose();
  };

  const modalTitle =
    mode === "create" ? "Add Project Team Member" : "Edit Project Team Member";
  const successMessage =
    mode === "create"
      ? "Member added successfully"
      : "Member updated successfully";
  const buttonText =
    mode === "create"
      ? "Add Project Team Member"
      : "Update Project Team Member";

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} maxWidth="600px">
        <Heading heading={modalTitle} className="text-center" />
        <div className="space-y-6">
          {mode === "update" ? (
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
                {formData.email}
              </div>
            </div>
          ) : (
            <DropDown
              name="email"
              value={formData.email}
              onChange={(value) => handleSelectChange("email", value)}
              options={teamOptions}
              placeholder="Select Email Address"
              label="Email Address"
              isBigger
            />
          )}
          <DropDown
            name="roleId"
            label="Role"
            placeholder="Select Role"
            options={roles}
            value={formData.roleId}
            onChange={(value) => handleSelectChange("roleId", value)}
            isBigger
          />

          <div className="flex items-center gap-6">
            <div className="w-2/5">
              <Button content="Cancel" isSecondary onClick={handleModalClose} />
            </div>
            <div className="w-3/5">
              <Button
                content={buttonText}
                onClick={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={successModal} onClose={handleSuccessClose}>
        <div className="flex justify-center primary mb-4">
          <Icon icon={"simple-line-icons:check"} width={96} height={96} />
        </div>
        <Heading
          heading="Congratulations!"
          subtitle={successMessage}
          className="text-center"
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button
            content="Close"
            onClick={handleSuccessClose}
          />
        </div>
      </Modal>
    </>
  );
}