"use client";

import { Icon } from "@iconify/react";
import { ChangeEvent, useState } from "react";
import { useUIStore } from "@/store/ui-store";
import Modal from "@/ui/popup-modal";
import TextInput from "@/ui/form/text-input";
import Checkbox from "@/ui/form/checkbox";
import Button from "@/ui/form/button";

export default function EditRole() {
  const { isEditModalOpen, closeEditModal } = useUIStore();

  const [editRole, setEditRole] = useState({
    roleName: "",
    description: "",
    view: false,
    edit: false,
    delete: false,
    fullAccess: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name === "fullAccess") {
      setEditRole((prev) => ({
        ...prev,
        view: checked,
        edit: checked,
        delete: checked,
        fullAccess: checked,
      }));
    } else {
      setEditRole((prev) => {
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
  return (
    <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
      <div>
        <div className="flex justify-between items-start mb-10">
          <div className="text-[#0A0A0A] leading-5 space-y-1">
            <h2 className="text-2xl font-bold">Edit Role</h2>
            <p className="text-sm font-normal">
              Modify this user role with new specific permissions
            </p>
          </div>
          <Icon
            onClick={closeEditModal}
            icon="ic:round-close"
            width={25}
            height={25}
            className="cursor-pointer"
          />
        </div>
      </div>
      <form action="" className="space-y-4">
        <TextInput
          label="Role Name"
          value={editRole.roleName}
          onChange={handleInputChange}
          name="roleName"
          isUppercase={false}
        />
        <TextInput
          label="Description"
          value={editRole.description}
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
              isChecked={editRole.view}
              onChange={(checked) => handleCheckboxChange("view", checked)}
            />
            <Checkbox
              name="delete"
              label="Delete"
              isChecked={editRole.delete}
              onChange={(checked) => handleCheckboxChange("delete", checked)}
            />
            <Checkbox
              name="edit"
              label="Edit"
              isChecked={editRole.edit}
              onChange={(checked) => handleCheckboxChange("edit", checked)}
            />
            <Checkbox
              name="fullAccess"
              label="Full Access"
              isChecked={editRole.fullAccess}
              onChange={(checked) =>
                handleCheckboxChange("fullAccess", checked)
              }
            />
          </div>
        </div>
        <Button content="Edit Role" />
      </form>
    </Modal>
  );
}
