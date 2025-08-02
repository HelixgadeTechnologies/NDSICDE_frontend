"use client";

import CardComponent from "@/ui/card-wrapper";
import TextInput from "@/ui/form/text-input";
import PasswordInput from "@/ui/form/password-input";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import { Icon } from "@iconify/react";

export default function SettingsComponents() {
  return (
    <div className="space-y-4">
      <CardComponent>
        <p className="text-sm">
          Update your account information and manage your profile
        </p>
        <div className="flex items-center mt-6 gap-6">
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
          <div className="grid grid-cols-2 gap-4 justify-between items-center w-full">
            <TextInput
            name="name"
            value=""
            label="Name"
            placeholder="John Doe"
            onChange={() => {}}
            />
            <TextInput
            name="email"
            value=""
            label="Email Address"
            placeholder="partner@sdn.org"
            onChange={() => {}}
            />
            <TextInput
            name="phoneNumber"
            value=""
            label="Phone Number"
            placeholder="0901 234 5678"
            onChange={() => {}}
            />
            <TextInput
            name="rolesandPermission"
            value=""
            label="Roles and Permissison"
            placeholder="Project Manager"
            onChange={() => {}}
            />
          </div>
        </div>
      </CardComponent>

      <CardComponent>
        <Heading heading="Change Password" />
        <div className="grid grid-cols-2 gap-y-3 gap-x-8 mt-6">
          <PasswordInput
            value=""
            onChange={() => {}}
            label="Current Password"
            name="currentPassword"
            placeholder="Enter Current Password"
          />
          <PasswordInput
            value=""
            onChange={() => {}}
            label="New Password"
            name="newPassword"
            placeholder="Enter New Password"
          />
          <PasswordInput
            value=""
            onChange={() => {}}
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Re-enter New Password"
          />
        </div>
      </CardComponent>
      <div className="w-[360px]">
        <Button content="Save Changes" isDisabled />
      </div>
    </div>
  );
}
