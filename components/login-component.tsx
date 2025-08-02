"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import EmailInput from "@/ui/form/email-input";
import PasswordInput from "@/ui/form/password-input";
import Checkbox from "@/ui/form/checkbox";
import Button from "@/ui/form/button";
import { MOCK_USERS, useRoleStore, UserRole } from "@/store/role-store";
import { useRouter } from "next/navigation";
import { getDefaultRouteForRole } from "@/lib/auth";

export default function Login() {

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const router = useRouter();
  const { login } = useRoleStore();

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

  
  const handleLogin = (e?: React.FormEvent) => {
    // Prevent form submission
    if (e) {
      e.preventDefault();
    }
    const user = MOCK_USERS[selectedRole];
    login(user);
    
    const redirectPath = getDefaultRouteForRole(selectedRole);
    router.push(redirectPath);
  };

  return (
    <div className="rounded-[10px] md:border border-[#D0D5DD] bg-white py-8 px-7 w-[450px] h-[480px]">
      <h4 className="font-semibold text-2xl md:text-[28px] text-gray-900 text-center mb-2">
        Log In
      </h4>
      <p className="text-sm font-normal text-gray-500 text-center">
        Enter your credentials to access your account
      </p>

      {/* space-y-6 */}
      <form action="" className="mt-8 space-y-4">
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
          uppercase
          isBigger
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

        {/* to test roles */}
         <div className="flex items-center gap-2">
              {Object.entries(MOCK_USERS).map(([role, user]) => (
                <label key={role} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="h-4 w-4 accent-red-600 border-gray-300 focus:ring-red-500 cursor-pointer"
                  />
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {user.role}
                  </div>
                </label>
              ))}
            </div>

        <div className="mt-4">
          <Button content="Log into Account" onClick={handleLogin} />
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
