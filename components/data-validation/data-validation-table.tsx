"use client";

import CardComponent from "@/ui/card-wrapper";
import Modal from "@/ui/popup-modal";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function DataValidationTable () {
    const head = ["Submission Name/Type", "Project", "Submitted By", "Date Submitted", "Status", "Action"];
    const data = [
        {
            id: 1,
            name: "Q3 Financial Report",
            project: "Community Health Initiative",
            submittedBy: "John Doe",
            date: "May 15, 2023 10:30",
            status: "Active",
        },
        {
            id: 2,
            name: "Beneficiary Enrollment Update",
            project: "Community Health Initiative",
            submittedBy: "John Doe",
            date: "May 15, 2023 10:30",
            status: "Approved",
        },
        {
            id: 3,
            name: "Training Completion Report",
            project: "Community Health Initiative",
            submittedBy: "John Doe",
            date: "May 15, 2023 10:30",
            status: "Rejected",
        },
    ];

    const [isOpenModal, setIsOpenModal] = useState(false);
    return (
        <>
            <CardComponent>
                <Table
                tableHead={head}
                tableData={data}
                checkbox
                idKey="id"
                renderRow={(row => (
                    <>
                        <td className="px-6">{row.name}</td>
                        <td className="px-6">{row.project}</td>
                        <td className="px-6">{row.submittedBy}</td>
                        <td className="px-6">{row.date}</td>
                        <td className="px-6">{row.status}</td>
                        <td className="px-6">
                            <div className="flex gap-2">
                                <Icon icon={"fluent-mdl2:view"} width={16} height={16} onClick={() => setIsOpenModal(true)}  />
                                <Icon icon={"fluent-mdl2:accept"} width={16} height={16} color="#22C55E" />
                                <Icon icon={"fluent-mdl2:cancel"} width={16} height={16} color="#EF4444"  />
                            </div>
                        </td>
                    </>
                ))}
                />
            </CardComponent>


            <Modal
            isOpen={isOpenModal}
            onClose={() => setIsOpenModal(false)}
            >hi</Modal>
        </>
    )
}