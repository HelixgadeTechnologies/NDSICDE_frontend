"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import EmailInput from "@/ui/form/email-input";
import Button from "@/ui/form/button";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";
import { apiResetPassword } from "@/lib/auth";

export default function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [userData, setUserData] = useState({
    email: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!userData.email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Make API call
      const response = await apiResetPassword({
        email: userData.email,
      });

      console.log('Reset password response:', response);
      
      // Check if reset was successful
      if (response.success) {
        setIsOpen(true);
      } else {
        setError(response.message || 'Password reset failed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleProceedToLogin = () => {
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <>
      <div className="rounded-[10px] md:border border-[#D0D5DD] bg-white py-8 px-7 w-[450px] h-fit">
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
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
          
          <div className="mt-6">
            <Button 
              content={"Reset Password"} 
              isDisabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleModalClose}>
          <div className="flex justify-center primary mb-4">
            <Icon icon={"simple-line-icons:check"} width={96} height={96} />
          </div>
          <h2 className="text-[28px] font-semibold mb-2 text-center text-gray-900">
            Password Reset Successful!
          </h2>
          <p className="text-sm text-center text-gray-500 mb-2">
            Your password has been reset successfully.
          </p>
          <p className="text-sm text-center text-gray-700 font-medium">
            Your new password is: <span className="bg-red-100 px-2 py-1 rounded font-mono">12345</span>
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={handleProceedToLogin}
              content="Proceed to Login"
            />
          </div>
        </Modal>
      )}
    </>
  );
}