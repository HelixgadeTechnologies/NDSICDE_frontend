"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import { UserDetails } from "@/types/team-members";
import Checkbox from "@/ui/form/checkbox";
import { useState } from "react";
import Button from "@/ui/form/button";

type DeleteProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetails;
};

export default function DeleteTeamMember({
  isOpen,
  onClose,
  user,
}: DeleteProps) {
  const [checked, setChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleChecked = () => {
    setChecked(!checked);
    setIsDisabled(!isDisabled);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <div className="space-y-3">
        <Heading
          heading="Remove Team Member"
          subtitle={`Are you sure you want to remove ${user.fullName} from the team?`}
        />
        <div className="h-[112px] w-full rounded-2xl bg-black/5 flex gap-2 items-center p-4">
          <div className="h-20 w-20 rounded-full bg-[#EAEAEA] flex justify-center items-center">
            <Icon icon={"radix-icons:avatar"} height={60} width={60} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-black text-base leading-8">
              {user.fullName}
            </h3>
            <p className="text-sm text-[#7A7A7A] leading-5">
              {user.emailAddress}
            </p>
            <p className="text-sm text-[#7A7A7A] leading-5">
              Role: {user.role}
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-black text-base leading-8">
            This action will:
          </h3>
          <ul className="list-disc text-sm text-[#7A7A7A] leading-5 ml-6">
            <li>Remove the user from all assigned projects</li>
            <li>Revoke all access permissions</li>
            <li>Delete their account association with your team</li>
          </ul>
        </div>
        <div className="bg-red-50 h-16 w-full p-4">
          <p className="text-[#EF4444] font-bold">
            This action cannot be undone
          </p>
        </div>
        <Checkbox
          label="I understand that this action is permanent"
          name="checkbox"
          isChecked={checked}
          onChange={handleChecked}
        />
        <Button content="Remove Member" isDisabled={isDisabled} />
      </div>
    </Modal>
  );
}
