// settings for every other user except super admin

"use client";

import CardComponent from "@/ui/card-wrapper";
import TextInput from "@/ui/form/text-input";
import PasswordInput from "@/ui/form/password-input";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import { Icon } from "@iconify/react";
import { useManagementSettingsState } from "@/store/management-staff-store/settings-store";

export default function GeneralSettings() {
  const {
    name,
    email,
    phoneNumber,
    rolesAndPermissions,
    currentPassword,
    newPassword,
    confirmPassword,
    setField,
  } = useManagementSettingsState();
  return (
    <div className="space-y-4">
      {/* <CardComponent>
        <p className="text-sm">
          Update your account information and manage your profile
        </p>
        <div className="flex flex-col md:flex-row items-center mt-6 gap-6">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="h-[110px] w-[110px] rounded-full bg-[#EAEAEA] p-2 flex justify-center items-center">
              <Icon
                icon={"radix-icons:avatar"}
                height={80}
                width={80}
                color="#000"
              />
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
            <TextInput
              name="rolesandPermission"
              value={rolesAndPermissions}
              label="Roles and Permissison"
              placeholder="Project Manager"
              onChange={(e) => setField("rolesAndPermissions", e.target.value)}
            />
          </div>
        </div>
      </CardComponent> */}

      <CardComponent>
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
      </CardComponent>
      <div className="w-full md:w-90">
        <Button content="Save Changes" isDisabled />
      </div>
    </div>
  );
}
