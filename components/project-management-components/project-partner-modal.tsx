"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { DropdownOption } from "@/types/project-management-types";
import { getToken } from "@/lib/api/credentials";
import { useParams } from "next/navigation";

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
}: AddProps) {
  const [successModal, setSuccessModal] = useState(false);
  const token = getToken();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // extract project id from url
  const params = useParams();
  const [formData, setFormData] = useState({
    partnerId: "",
    organizationName: "",
    email: "",
    roleId: "",
    projectId: ""
  });

  // initialize form data based on mode 
  useEffect(() =>  {
    if (!isOpen) return;

    if (mode === "update" && initialData) {
      const projectId = propProjectId || (params?.id as string) || "";
      setFormData({
        partnerId: initialData.partnerId || "",
        email: initialData.email || "",
        roleId: initialData.roleId || "",
        organizationName: initialData.organizationName || "",
        projectId: projectId,
      });
    } else {
      // reset form for create mode
      const projectId = propProjectId || (params?.id as string) || "";
      setFormData({
        partnerId: "",
        email: "",
        organizationName: "",
        roleId: "",
        projectId: projectId,
      })
    }
  }, [mode, initialData, propProjectId, isOpen, params]);

  

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
        <Heading heading="Add Project Partner" className="text-center" />
        <div className="space-y-6 mt-6">
          <TextInput
            name="partnerOrganizationName"
            value=""
            onChange={() => {}}
            placeholder="---"
            label="Partner Organization Name"
            isBigger
          />
          <DropDown
            name="contactEmail"
            label="Contact Person Email Address"
            placeholder="user@gmail.com"
            options={[]}
            value=""
            onChange={() => {}}
            isBigger
          />
          <DropDown
            name="role"
            label="Role"
            placeholder="Enter Role"
            options={[]}
            value=""
            onChange={() => {}}
            isBigger
          />
          <div className="flex items-center gap-6">
            <Button content="Cancel" isSecondary onClick={onClose} />
            <Button
              content="Add Project Partners"
              onClick={() => {
                onClose();
                setSuccessModal(true);
              }}
            />
          </div>
        </div>
      </Modal>

      {/* success modal */}
      <Modal isOpen={successModal} onClose={() => setSuccessModal(false)}>
        <div className="flex justify-center primary mb-4">
          <Icon icon={"simple-line-icons:check"} width={96} height={96} />
        </div>
        <Heading
          heading="Congratulations!"
          subtitle="Partner added successfully"
          className="text-center"
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button content="Close" onClick={onSuccess} />
        </div>
      </Modal>
    </>
  );
}
