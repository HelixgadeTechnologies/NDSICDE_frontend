"use client";

import { UserDetails } from "@/types/team-members";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import MultiSelectDropdown from "@/ui/form/multi-select-dropdown";
import { useUserManagementState } from "@/store/user-management";
import { ChangeEvent } from "react";

type EditProps = {
    isOpen: boolean;
    onClose: () => void;
    user: UserDetails;
}

export default function EditTeamMember({isOpen, onClose, user}: EditProps) {
    const { 
        fullName, 
        emailAddress, 
        department, 
        phoneNumber,
        role,
        status,
        assignedProjects,
        setField,
    } = useUserManagementState();

    const options = [
        { label: "Healthcare Initiative", value: "healthcare" },
        { label: "Education Program", value: "education" },
        { label: "Clean Water Project", value: "water" },
        { label: "Clean Water One", value: "one" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
            <Heading heading="User Profile" subtitle={`Detailed information about ${user.fullName}`} />
            <form action="">
                <div className="grid grid-cols-2 my-4 gap-4">
                    <TextInput
                    value={fullName}
                    label="Full Name"
                    name="fullName"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("fullName", e.target.value)}
                    />
                    <TextInput
                    value={emailAddress}
                    label="Email Address"
                    name="emailAddress"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("emailAddress", e.target.value)}
                    />
                    <DropDown
                    label="Role"
                    options={[]}
                    name="role"
                    value={role}
                    onChange={(value: string) => setField("role", value)}
                    />
                    <DropDown
                    label="Department"
                    options={[]}
                    name="department"
                    value={department}
                    onChange={(value: string) => setField("department", value)}
                    />
                    <TextInput
                    value={phoneNumber}
                    label="Phone Number"
                    name="phoneNumber"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("phoneNumber", e.target.value)}
                    />
                    <DropDown
                    label="Status"
                    options={[]}
                    name="status"
                    value={status}
                    onChange={(value: string) => setField("status", value)}
                    />
                    <div className="col-span-2">
                        <MultiSelectDropdown
                        label="Assigned Projects"
                        options={options}
                        selected={assignedProjects}
                        onChange={(selected) => setField("assignedProjects", selected)}
                        />
                    </div>
                </div>
                <Button content="Save Changes" />
            </form>
        </Modal>
    )
}