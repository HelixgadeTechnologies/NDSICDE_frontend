"use client";

import { Icon } from "@iconify/react";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useUIStore } from "@/store/ui-store";
import Modal from "@/ui/popup-modal";
import TextInput from "@/ui/form/text-input";
import Checkbox from "@/ui/form/checkbox";
import Button from "@/ui/form/button";
import axios from "axios";
import toast from "react-hot-toast";
import { getToken } from "@/lib/api/credentials";

// Define the role data type
type RoleData = {
  roleId: string;
  roleName: string;
  description: string;
  permission: string;
};

// Define the props
type RoleFormModalProps = {
  onSuccess: () => void;
  mode: "create" | "edit";
  roleData?: RoleData; // Optional role data for edit mode
  isOpen: boolean; // Add isOpen prop
  onClose: () => void; // Add onClose prop
};

export default function RoleFormModal({ 
  onSuccess, 
  mode, 
  roleData, 
  isOpen,
  onClose
}: RoleFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = getToken();

  const [roleForm, setRoleForm] = useState({
    roleId: "",
    roleName: "",
    description: "",
    view: false,
    edit: false,
    delete: false,
    fullAccess: false,
  });

  // Initialize form with role data when in edit mode
  useEffect(() => {
    if (mode === "edit" && roleData) {
      // Parse permission string to checkboxes
      const permissions = roleData.permission.split(",").map(Number);
      
      setRoleForm({
        roleId: roleData.roleId || "",
        roleName: roleData.roleName || "",
        description: roleData.description || "",
        view: permissions.includes(1),
        edit: permissions.includes(2),
        delete: permissions.includes(3),
        fullAccess: permissions.includes(4),
      });
    }
  }, [mode, roleData, isOpen]); // Add isOpen to dependency array

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name === "fullAccess") {
      // If fullAccess is checked, check all permissions
      setRoleForm((prev) => ({
        ...prev,
        view: checked,
        edit: checked,
        delete: checked,
        fullAccess: checked,
      }));
    } else {
      // For other checkboxes, update individually
      setRoleForm((prev) => {
        const newState = {
          ...prev,
          [name]: checked,
        };

        // If any individual permission is unchecked, uncheck fullAccess
        if (!checked) {
          newState.fullAccess = false;
        }
        // If all individual permissions are checked, check fullAccess
        else if (newState.view && newState.edit && newState.delete) {
          newState.fullAccess = true;
        }

        return newState;
      });
    }
  };

  // Function to convert checkboxes to permission string
  const getPermissionString = () => {
    const permissions: number[] = [];
    
    // Map checkboxes to numbers based on order (view=1, edit=2, delete=3, fullAccess=4)
    if (roleForm.view) permissions.push(1);
    if (roleForm.edit) permissions.push(2);
    if (roleForm.delete) permissions.push(3);
    if (roleForm.fullAccess) permissions.push(4);
    
    // Return comma-separated string or empty string if no permissions
    return permissions.length > 0 ? permissions.join(",") : "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!roleForm.roleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    if (!roleForm.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const permissionString = getPermissionString();
    if (!permissionString) {
      toast.error("Please select at least one permission");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const isCreate = mode === "create";
      const payload = {
        isCreate: isCreate,
        data: {
          roleId: isCreate ? "" : roleForm.roleId,
          roleName: roleForm.roleName,
          description: roleForm.description,
          permission: permissionString,
        },
      };

      console.log(`${mode === "create" ? "Creating" : "Updating"} role with payload:`, payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/register-role`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      if (response.data.success) {
        const successMessage = mode === "create" 
          ? "Role created successfully!" 
          : "Role updated successfully!";
        
        toast.success(successMessage);
        
        // Reset form for create mode only
        if (mode === "create") {
          setRoleForm({
            roleId: "",
            roleName: "",
            description: "",
            view: false,
            edit: false,
            delete: false,
            fullAccess: false,
          });
        }
        
        // Close modal
        onClose();
        onSuccess();
      } else {
        toast.error(response.data.message || `Failed to ${mode} role`);
      }
    } catch (error: any) {
      console.error(`Error ${mode}ing role:`, error);
      
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error. Please check your connection");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    // Reset form when closing if in create mode
    if (mode === "create") {
      setRoleForm({
        roleId: "",
        roleName: "",
        description: "",
        view: false,
        edit: false,
        delete: false,
        fullAccess: false,
      });
    }
    onClose();
  };

  const modalTitle = mode === "create" ? "Add New Role" : "Edit Role";
  const modalDescription = mode === "create" 
    ? "Create a new user role with specific permissions" 
    : "Update the user role with new permissions";
  const buttonText = mode === "create" ? "Create Role" : "Update Role";

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <div>
        <div className="flex justify-between items-start mb-10">
          <div className="text-[#0A0A0A] leading-5 space-y-1">
            <h2 className="text-2xl font-bold">{modalTitle}</h2>
            <p className="text-sm font-normal">{modalDescription}</p>
          </div>
          <Icon
            onClick={handleCloseModal}
            icon="ic:round-close"
            width={25}
            height={25}
            className="cursor-pointer"
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Role Name"
          value={roleForm.roleName}
          onChange={handleInputChange}
          name="roleName"
          isUppercase={false}
        />
        <TextInput
          label="Description"
          value={roleForm.description}
          onChange={handleInputChange}
          name="description"
          isUppercase={false}
        />
        <div>
          <h4 className="font-bold leading-9">Permission Level</h4>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-2 mb-5">
            <Checkbox
              name="view"
              label="View"
              isChecked={roleForm.view}
              onChange={(checked) => handleCheckboxChange("view", checked)}
            />
            <Checkbox
              name="delete"
              label="Delete"
              isChecked={roleForm.delete}
              onChange={(checked) => handleCheckboxChange("delete", checked)}
            />
            <Checkbox
              name="edit"
              label="Edit"
              isChecked={roleForm.edit}
              onChange={(checked) => handleCheckboxChange("edit", checked)}
            />
            <Checkbox
              name="fullAccess"
              label="Full Access"
              isChecked={roleForm.fullAccess}
              onChange={(checked) =>
                handleCheckboxChange("fullAccess", checked)
              }
            />
          </div>
        </div>
        <Button 
          content={buttonText} 
          isLoading={isSubmitting}
          type="submit"
          isDisabled={isSubmitting}
        />
      </form>
    </Modal>
  );
}