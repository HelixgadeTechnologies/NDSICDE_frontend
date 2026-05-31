"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import { UserDetails } from "@/types/team-members";
import { useProjects } from "@/context/ProjectsContext";
import { toSentenceCase } from "@/utils/ui-utility";

type ViewProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetails;
};

export default function ViewTeamMember({ isOpen, onClose, user }: ViewProps) {
  const { projects } = useProjects();

  // The user record only stores the assigned project's uuid — resolve it to a readable name from the already-loaded projects list.
  const assignedProjectName =
    projects.find((p) => p.projectId === user?.assignedProjectId)?.projectName ??
    "N/A";

  if (!user) return (
    <p>User not found.</p>
  )
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <Heading
        heading="User Profile"
        subtitle={`Update details, role, and project access for ${user.fullName}`}
      />
      <div className="mt-8">
        <div className="flex flex-col justify-center items-center">
          <div className="size-27.5 rounded-full bg-[#EAEAEA] p-2 flex justify-center items-center">
            <Icon
              icon={"radix-icons:avatar"}
              height={80}
              width={80}
              color="#000"
            />
          </div>
          <h3 className="font-bold text-black text-base leading-8">
            {user.fullName || "N/A"}
          </h3>
          <p className="text-[#7A7A7A] text-sm font-normal leading-5">
            {user.email || "N/A"}
          </p>
        </div>
        <div>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Role:
              </strong>
              <span className="text-[#7A7A7A] text-sm font-normal leading-5">
                {user.roleName || "N/A"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Department:
              </strong>
              <span className="text-[#7A7A7A] text-sm font-normal leading-5">
                {user.department || "N/A"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Status:
              </strong>
              <span
                className={`text-sm font-normal leading-5 ${
                  user.status === "Active" || user.status === "ACTIVE" ? "text-green-500" : "text-red-500"
                }`}
              >
                {user.status || "N/A"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Phone Number:
              </strong>
              <span className="text-[#7A7A7A] text-sm font-normal leading-5">
                {user.phoneNumber || "N/A"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <strong className="font-bold text-black text-base leading-8">
                Assigned Projects:
              </strong>
              <span title={assignedProjectName} className="text-[#7A7A7A] text-sm font-normal leading-5">
                {toSentenceCase(assignedProjectName)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
