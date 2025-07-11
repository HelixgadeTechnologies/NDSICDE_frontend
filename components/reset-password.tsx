"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import EmailInput from "@/ui/email-input";
import Button from "@/ui/button";
import Modal from "@/ui/modal";
import { SlCheck } from "react-icons/sl";

export default function ResetPassword() {
    const router = useRouter();

    const [userData, setUserData] = useState({
        email: "",
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const [isOpen, setIsOpen] = useState(false);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsOpen(true);
    };

    const handleModalClose = () => setIsOpen(false);

    return (
        <>
            <div className="rounded-[10px] md:border border-[#D0D5DD] bg-white py-8 px-7 w-[450px] h-[320px]">
                <h4 className="font-semibold text-2xl md:text-[28px] text-gray-900 text-center mb-2">Forgot Password</h4>
                <p className="text-sm font-normal text-gray-500 text-center">Enter your credentials to access your account</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <EmailInput
                    value={userData.email}
                    onChange={handleInputChange}
                    name="email"
                    label="Email address"
                    placeholder="Enter Email"
                    />
                    <div className="mt-4">
                        <Button
                        content="Log into Account"
                        />
                    </div>
                </form>
            </div>

            {isOpen && 
            (<Modal
                icon={<SlCheck/>}
                isOpen={isOpen}
                onClose={handleModalClose}
                header="Congratulations!"
                message="Your Password Reset was Successful"
                buttonContent="Proceed to Login"
                onClick={() => router.push("/login")}
            />)}
        </>
    )
}