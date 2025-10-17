"use client";

import { useRoleStore } from "@/store/role-store";
import BackButton from "@/ui/back-button";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import DeleteModal from "@/ui/generic-delete-modal";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { notFound, usePathname } from "next/navigation";
import { useState } from "react";

export default function ProjectDetails() {
     const projects = [
    {
      id: "1",
      projectCode: "PRJ001",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Active",
      startDate: "Jan 15, 2023",
      endDate: "Jan 30, 2024",
      team: "Health Teams",
    },
    {
      id: "2",
      projectCode: "PRJ002",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Completed",
      startDate: "Jan 15, 2023",
      endDate: "Jan 30, 2024",
      team: "Health Team",
    },
    {
      id: "3",
      projectCode: "PRJ003",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "On Hold",
      startDate: "Jan 15, 2023",
      endDate: "Jan 30, 2024",
      team: "Health Team",
    },
  ];
    const pathname = usePathname();
    const projectId = pathname.split("/").pop();
    const selectedProject = projects.find(project => project.id === projectId);
    const { user } = useRoleStore();

    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
  
    if (!selectedProject) {
        return notFound()
    }
    return (
        <section>
            <BackButton/>
            <div className="space-y-4">
                <Heading heading={selectedProject.projectName} />
                <div className="flex gap-1 items-center">
                    <h4 className="font-semibold">Strategic Objective:</h4>
                    <p>{selectedProject.strategicObjective}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <h4 className="font-semibold">Project Code:</h4>
                    <p>{selectedProject.projectCode}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <h4 className="font-semibold">Status:</h4>
                    <p className={selectedProject.status === "Active" ? "text-green-500" : selectedProject.status === "On Hold" ? "text-yellow-500" : "text-red-500"}>{selectedProject.status}</p>
                </div>
               <div className="flex gap-1 items-center">
                    <h4 className="font-semibold">Registered Start Date:</h4>
                    <p>{selectedProject.startDate}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <h4 className="font-semibold">Registered End Date:</h4>
                    <p>{selectedProject.endDate}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <h4 className="font-semibold">Project Team:</h4>
                    <p>{selectedProject.team}</p>
                </div>

                {/* buttons */}
                <div className="flex items-center gap-4 mt-5">
                    <div className="w-[200px]">
                        <Button content="Edit Project" isSecondary onClick={() => setEditModal(true)} />
                    </div>
                   {user?.role === "super-admin" && (
                    <div className="w-[200px]">
                        <Button content="Delete Project" onClick={() => setDeleteModal(true)}/>
                    </div>
                   )}
                </div>
            </div>

            {/* edit modal */}
            <Modal isOpen={editModal} onClose={() => setEditModal(false)} maxWidth="600px">
                <Heading heading="Edit Project" className="text-center" />
                <div className="gap-2 grid grid-cols-2 mt-4 mb-6">
                    <TextInput
                    name="project_name"
                    value=""
                    onChange={() => {}}
                    label="Project Name"
                    />
                    <TextInput
                    name="stratetic_objective"
                    value=""
                    onChange={() => {}}
                    label="Strategic Objective"
                    />
                    <TextInput
                    name="project_code"
                    value=""
                    onChange={() => {}}
                    label="Project Code"
                    />
                    <TextInput
                    name="status"
                    value=""
                    onChange={() => {}}
                    label="Status"
                    />
                   <DateInput
                    label="Start Date"
                    />
                    <DateInput
                    label="End Date"
                    />
                    <div className="col-span-2">
                        <DropDown
                        name="project_team"
                        value=""
                        onChange={() => {}}
                        options={[]}
                        label="Project Team"
                        />
                    </div>
                </div>
                <Button content="Save"/>
            </Modal>

            {/* delete */}
            <DeleteModal
            isOpen={deleteModal}
            onClose={() => setDeleteModal(false)}
            heading="Do you want to delete this project?"
            />
        </section>
    )
}