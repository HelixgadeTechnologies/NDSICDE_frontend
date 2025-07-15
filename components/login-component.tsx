"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import EmailInput from "@/ui/form/email-input";
import PasswordInput from "@/ui/form/password-input";
import Checkbox from "@/ui/form/checkbox";
import Button from "@/ui/form/button";

export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    isChecked: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // for checkbox
  const handleCheckboxChange = (checked: boolean) => {
    setUserData((prev) => ({
      ...prev,
      isChecked: checked,
    }));
  };

  return (
    <div className="rounded-[10px] md:border border-[#D0D5DD] bg-white py-8 px-7 w-[450px] h-[480px]">
      <h4 className="font-semibold text-2xl md:text-[28px] text-gray-900 text-center mb-2">
        Log In
      </h4>
      <p className="text-sm font-normal text-gray-500 text-center">
        Enter your credentials to access your account
      </p>

      <form action="" className="mt-8 space-y-6">
        <EmailInput
          value={userData.email}
          onChange={handleInputChange}
          name="email"
          label="Email address"
          placeholder="Enter Email"
        />
        <PasswordInput
          value={userData.password}
          onChange={handleInputChange}
          name="password"
          label="password"
          placeholder="Enter Password"
        />
        <div className="flex justify-between items-center">
          <Checkbox
            name="terms"
            label="Remember me for 30 days"
            isChecked={userData.isChecked}
            onChange={handleCheckboxChange}
          />
          <Link
            href={"/reset-password"}
            className="primary hidden md:block text-sm font-medium hover:underline whitespace-nowrap"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4">
          <Button content="Log into Account" href="/admin/dashboard" />
        </div>
        <Link
          href={"/reset-password"}
          className="primary block md:hidden text-xs font-medium hover:underline whitespace-nowrap text-center"
        >
          Forgot Password?
        </Link>
      </form>
    </div>
  );
}
