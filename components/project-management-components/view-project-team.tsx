"use client";

import { ProjectTeamDetails } from "@/types/project-management-types";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";
import Heading from "@/ui/text-heading";

type ViewProps = {
  isOpen: boolean;
  onClose: () => void;
  member: ProjectTeamDetails;
};

export default function ViewProjectTeamModal({
  isOpen,
  onClose,
  member,
}: ViewProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <Heading
        heading="User Profile"
        subtitle={`Update details, role, and project access for ${member.name}`}
      />
      <div className="mt-8">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="h-[110px] w-[110px] rounded-full bg-[#EAEAEA] p-2 flex justify-center items-center">
            <Icon
              icon={"radix-icons:avatar"}
              height={80}
              width={80}
              color="#000"
            />
          </div>
          <h3 className="font-bold text-black text-base leading-8">
            {member.name || "N/A"}
          </h3>
          <p className="text-[#7A7A7A] text-sm font-normal leading-5">
            {member.email || "N/A"}
          </p>
        </div>
        <div>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Role:
              </strong>
              <span className="text-[#7A7A7A] text-sm font-normal leading-5">
                {member.role || "N/A"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Department:
              </strong>
              <span className="text-[#7A7A7A] text-sm font-normal leading-5">
                Department Name
              </span>
            </li>
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Status:
              </strong>
              <span
                className={`text-sm font-normal leading-5 ${
                  member.status === "Active" ? "text-green-500" : "text-red-500"
                }`}
              >
                {member.status || "N/A"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Phone Number:
              </strong>
              <span className="text-[#7A7A7A] text-sm font-normal leading-5">
                0903946752
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
