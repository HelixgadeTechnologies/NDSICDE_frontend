// settings for every other user except super admin

"use client";

import CardComponent from "@/ui/card-wrapper";
import TextInput from "@/ui/form/text-input";
import PasswordInput from "@/ui/form/password-input";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import { Icon } from "@iconify/react";
import { useManagementSettingsState } from "@/store/management-staff-store/settings-store";
import Image from "next/image";
import { useRoleStore } from "@/store/role-store";
import { FormEvent, useState } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";
import Modal from "@/ui/popup-modal";

export default function GeneralSettings() {
  const {
    name,
    email,
    phoneNumber,
    // rolesAndPermissions,
    currentPassword,
    newPassword,
    confirmPassword,
    setField,
  } = useManagementSettingsState();
  const { user } = useRoleStore();

  // for the changing password 
  const [isLoading, setIsLoading] = useState(false);
  // for the updating details
  const [isUpdating, setIsUpdating] = useState(false);

  // for updating user details - modal and password confirmation
  const [openModal, setOpenModal] = useState(false);
  const [password, setPassword] = useState("");
  const token = getToken();

  // function to handle password change
  const handleChangePassword = async () => {
    const payload = {
      oldPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/change-password`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message || "Password updated successfully");
      // Clear password fields after successful update
      setField("currentPassword", "");
      setField("newPassword", "");
      setField("confirmPassword", "");
    } catch (error) {
      console.error("Error updating password: ", error);
      toast.error('Error updating password')
    } finally {
      setIsLoading(false);
    }
  };

  // vallidation before opening modal
  const handleOpenModal = () => {
    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setOpenModal(true);
  }

  // function to update details after confirming password in modal
  const handleUpdateDetails = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      userId: user?.id,
      fullName: name,
      email: email,
      phoneNumber: phoneNumber,
      roleId: user?.roleId,
      password: password
    }

    if (!password) {
      toast.error("Please enter your current password to confirm changes");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/update-login-user`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      toast.success(res.data.message || "Details updated successfully");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating details: ", error);
      toast.error('Error updating details')
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* basic details */}
      <CardComponent>
        <p className="text-sm">
          Update your account information and manage your profile
        </p>
        <div className="flex flex-col md:flex-row items-center mt-6 gap-6">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="h-27.5 w-27.5 rounded-full bg-[#EAEAEA] p-2 flex justify-center items-center relative">
              {user?.avatar ? <Image
              src={user?.avatar}
              alt="avatar"
              fill
              className="rounded-full object-cover"
              /> : <Icon
                icon={"radix-icons:avatar"}
                height={80}
                width={80}
                color="#000"
              />}
            </div>
            <p className="text-[#D2091E] text-sm font-medium leading-5 whitespace-nowrap">
              Update Profile Picture
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between items-center w-full">
            <TextInput
              name="name"
              value={name}
              label="Name"
              placeholder="John Doe"
              onChange={(e) => setField("name", e.target.value)}
            />
            <TextInput
              name="email"
              value={email}
              label="Email Address"
              placeholder="management@sdn.org"
              onChange={(e) => setField("email", e.target.value)}
            />
            <TextInput
              name="phoneNumber"
              value={phoneNumber}
              label="Phone Number"
              placeholder="0901 234 5678"
              onChange={(e) => setField("phoneNumber", e.target.value)}
            />
          </div>
        </div>

        {/* really nested button */}
        <div className="flex w-full justify-end">
          <div className="w-full md:w-50 mt-5">
            <Button
              content="Update Details"
              isDisabled={isLoading}
              onClick={handleOpenModal}
            />
          </div>
        </div>
      </CardComponent>

      {/* password */}
      <CardComponent className="relative">
        <Heading heading="Change Password" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mt-6">
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setField("currentPassword", e.target.value)}
            label="Current Password"
            name="currentPassword"
            placeholder="Enter Current Password"
          />
          <PasswordInput
            value={newPassword}
            onChange={(e) => setField("newPassword", e.target.value)}
            label="New Password"
            name="newPassword"
            placeholder="Enter New Password"
          />
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setField("confirmPassword", e.target.value)}
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Re-enter New Password"
          />
        </div>
        <div className="w-full md:w-50 mt-5 absolute right-5 bottom-7">
          <Button
            content="Save Password"
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={handleChangePassword}
          />
        </div>
      </CardComponent>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <Heading heading="Confirm Password" subtitle="Enter your current password to confirm update" className="text-center"/>
        <form className="space-y-5 mt-5">
          <TextInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="* * * * *"
          />
          <Button content="Confirm" onClick={handleUpdateDetails} isDisabled={isUpdating} isLoading={isUpdating} />
        </form>
      </Modal>
    </div>
  );
}
