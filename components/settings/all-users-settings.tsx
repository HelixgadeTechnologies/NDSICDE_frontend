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
import { FormEvent, useRef, useState, useEffect } from "react";
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

  // for profile picture
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // for updating user details - modal and password confirmation
  const [openModal, setOpenModal] = useState(false);
  const [password, setPassword] = useState("");
  const token = getToken();

  // Load user details into the form on mount or when user changes
  useEffect(() => {
    if (user) {
      if (user.name) setField("name", user.name);
      if (user.email) setField("email", user.email);
      if (user.phoneNumber) setField("phoneNumber", user.phoneNumber);
    }
  }, [user, setField]);

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
    } catch (error) {
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
      setField("name", "");
      setField("email", "");
      setField("phoneNumber", "");
    } catch (error) {
      console.error("Error updating details: ", error);
      toast.error('Error updating details')
    } finally {
      setIsUpdating(false);
    }
  }

  // for profile picture
  const handleUpdatePicture = async () => {
    if (!selectedFile) return;

    setIsUpdatingPicture(true);
    try {
      const reader = new FileReader();
      const base64String = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(selectedFile);
      });

      const payload = {
        base64String,
        mimeType: selectedFile.type
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/profile-picture`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error updating profile picture: ", error);
      toast.error('Error updating profile picture');
    } finally {
      setIsUpdatingPicture(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* basic details */}
      <CardComponent>
        <p className="text-sm">
          Update your account information and manage your profile
        </p>
        <div className="flex flex-col md:flex-row items-center mt-6 gap-6">
          <div className="flex flex-col justify-center items-center gap-2">
            <div 
              className="h-27.5 w-27.5 rounded-full bg-[#EAEAEA] p-2 flex justify-center items-center relative cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfilePictureClick}
              title="Click to select profile picture"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="avatar"
                  fill
                  className="rounded-full object-cover"
                />
              ) : user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt="avatar"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <Icon
                  icon={"radix-icons:avatar"}
                  height={80}
                  width={80}
                  color="#000"
                />
              )}
            </div>
            {selectedFile ? (
              <div className="flex items-center flex-row-reverse gap-2">
                <p 
                  className={`text-[#D2091E] text-sm font-medium leading-5 whitespace-nowrap ${isUpdatingPicture ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline'}`}
                  onClick={!isUpdatingPicture ? handleUpdatePicture : undefined}
                >
                  {isUpdatingPicture ? "Saving..." : "Save"}
                </p>
                {!isUpdatingPicture && (
                  <p 
                    className="text-gray-500 text-sm font-medium leading-5 whitespace-nowrap cursor-pointer hover:underline"
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  >
                    Cancel
                  </p>
                )}
              </div>
            ) : (
              <p 
                className="text-[#D2091E] text-sm font-medium leading-5 whitespace-nowrap cursor-pointer hover:underline"
                onClick={handleProfilePictureClick}
              >
                Update Profile Picture
              </p>
            )}
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
        <form className="space-y-5 mt-5" onSubmit={handleUpdateDetails}>
          <TextInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="* * * * *"
          />
          <Button content="Confirm" type="submit" isDisabled={isUpdating} isLoading={isUpdating} />
        </form>
      </Modal>
    </div>
  );
}
