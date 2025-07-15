"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import EmailInput from "@/ui/form/email-input";
import Button from "@/ui/form/button";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";

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
        <h4 className="font-semibold text-2xl md:text-[28px] text-gray-900 text-center mb-2">
          Forgot Password
        </h4>
        <p className="text-sm font-normal text-gray-500 text-center">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <EmailInput
            value={userData.email}
            onChange={handleInputChange}
            name="email"
            label="Email address"
            placeholder="Enter Email"
          />
          <div className="mt-4">
            <Button content="Log into Account" />
          </div>
        </form>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleModalClose}>
          <div className="flex justify-center primary mb-4">
            <Icon icon={"simple-line-icons:check"} width={96} height={96} />
          </div>
          <h2 className="text-[28px] font-semibold mb-2 text-center text-gray-900">
            Congratulations!
          </h2>
          <p className="text-sm text-center text-gray-500">
            Your Password Reset was Successful
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              onClick={() => router.push("/login")}
              content="Proceed to Login"
            />
          </div>
        </Modal>
      )}
    </>
  );
}
