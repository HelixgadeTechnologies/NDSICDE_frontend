"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { DropdownOption } from "@/app/(app)/projects/[id]/project-management/team/page";
import { useRoleStore } from "@/store/role-store";
import { useParams } from "next/navigation";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";

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
  const { user } = useRoleStore();
  const token = getToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [team, setTeam] = useState<any[]>([]);
  const [teamOptions, setTeamOptions] = useState<DropdownOption[]>([]);

  // Extract project ID from URL or props
  const params = useParams();
  const [formData, setFormData] = useState({
    id: "",
    teamMemberId: user?.id || "",
    email: "",
    roleId: "",
    projectId: "",
  });

  // Initialize form data based on mode
  useEffect(() => {
    if (!isOpen) return; // Only run when modal is open
    
    if (mode === "update" && initialData) {
      const projectId = propProjectId || (params?.id as string) || "";
      setFormData({
        id: initialData.id || "",
        teamMemberId: initialData.teamMemberId || user?.id || "",
        email: initialData.email || "",
        roleId: initialData.roleId || "",
        projectId: projectId,
      });
    } else {
      // Reset form for create mode
      const projectId = propProjectId || (params?.id as string) || "";
      setFormData({
        id: "",
        teamMemberId: user?.id || "",
        email: "",
        roleId: "",
        projectId: projectId,
      });
    }
  }, [mode, initialData, user, propProjectId, isOpen, params]);

  // Get all team members
  useEffect(() => {
    const getTeamMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/users`
        );
        setTeam(response.data.data);

        // Format team data for dropdown
        if (response.data.data && Array.isArray(response.data.data)) {
          const formattedOptions = response.data.data.map((member: any) => ({
            label: member.email,
            value: member.email,
          }));
          setTeamOptions(formattedOptions);
        }
      } catch (error) {
        console.error(`Error getting team members: ${error}`);
      }
    };
    getTeamMembers();
  }, []);

  // Submit form
  const handleSubmit = async () => {
    const payload = {
      isCreate: mode === "create",
      data: formData,
    };
    setIsSubmitting(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/team-member`;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      onClose();
      setSuccessModal(true);
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "submitting" : "updating"}: ${error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle change for input and select
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
    if (onSuccess) {
      onSuccess();
    }
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
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
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
              placeholder="Enter Email Address"
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
              <Button content="Cancel" isSecondary onClick={onClose} />
            </div>
            <div className="w-3/5">
              <Button
                content={buttonText}
                onClick={handleSubmit}
                isLoading={isSubmitting}
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
            isLoading={isSubmitting}
          />
        </div>
      </Modal>
    </>
  );
}