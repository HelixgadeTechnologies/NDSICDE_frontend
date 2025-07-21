import Modal from "@/ui/popup-modal"
import Heading from "@/ui/text-heading"
import { Icon } from "@iconify/react";
import { UserDetails } from "@/types/team-members";


type ViewProps = {
    isOpen: boolean;
    onClose: () => void;
    user: UserDetails;
}

export default function ViewTeamMember({isOpen, onClose, user}: ViewProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
            <Heading heading="User Profile" subtitle={`Update details, role, and project access for ${user.fullName}`} />
            <div className="mt-8">
                <div className="flex flex-col justify-center items-center">
                    <div className="h-[110px] w-[110px] rounded-full bg-[#EAEAEA] p-2 flex justify-center items-center">
                        <Icon icon={"radix-icons:avatar"} height={80} width={80} color="#000"  />
                    </div>
                    <h3 className="font-bold text-black text-base leading-8">{user.fullName}</h3>
                    <p className="text-[#7A7A7A] text-sm font-normal leading-5">{user.emailAddress}</p>
                </div>
                <div>
                    <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                            <strong className="font-bold text-black text-base leading-8">Role:</strong>
                            <span className="text-[#7A7A7A] text-sm font-normal leading-5">{user.role}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <strong className="font-bold text-black text-base leading-8">Department:</strong>
                            <span className="text-[#7A7A7A] text-sm font-normal leading-5">{user.department}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <strong className="font-bold text-black text-base leading-8">Status:</strong>
                            <span className={`text-sm font-normal leading-5 ${user.status === "Active" ? "text-green-500" : "text-red-500"}`}>{user.status}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <strong className="font-bold text-black text-base leading-8">Phone Number:</strong>
                            <span className="text-[#7A7A7A] text-sm font-normal leading-5">{user.phoneNumber}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <strong className="font-bold text-black text-base leading-8">Assigned Projects:</strong>
                            <span className="text-[#7A7A7A] text-sm font-normal leading-5">{user.assignedProjects}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </Modal>
    )
}