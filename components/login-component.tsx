"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import EmailInput from "@/ui/form/email-input";
import PasswordInput from "@/ui/form/password-input";
import Checkbox from "@/ui/form/checkbox";
import Button from "@/ui/form/button";
import { useRoleStore, UserRole } from "@/store/role-store";
import { useRouter } from "next/navigation";
import { apiLogin, decodeJWT } from "@/lib/api/auth";
import { toast } from "react-toastify";

// Map role names from API to your UserRole type
function mapRoleNameToUserRole(roleName: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    "SUPER ADMIN": "super-admin",
    "ADMIN": "admin",
    "PARTNERS": "partners",
    "PARTNER": "partners",
    "MANAGEMENT": "management",
    "MANAGEMENT & STAFF": "management",
    "RETIREMENT MANAGER": "r-managers",
    "R-MANAGER": "r-managers",
    "REQUEST AND RETIREMENT MANAGER": "r-managers",
    "TEAM MEMBER": "team-member",
    "TEAM MEMBERS": "team-member",
    "PROJECT TEAM": "team-member",
  };

  const normalizedRole = roleName.toUpperCase();
  return roleMap[normalizedRole] || "super-admin";
}

export default function Login() {
  const router = useRouter();
  const { login } = useRoleStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    isChecked: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleCheckboxChange = (checked: boolean) => {
    setUserData((prev) => ({ ...prev, isChecked: checked }));
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validation
    if (!userData.email || !userData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Make API call
      const response = await apiLogin({
        email: userData.email,
        password: userData.password,
      });

      // Extract token from response - the data field contains the JWT token directly
      const token = response.data;

      if (!token || typeof token !== "string") {
        console.error("Token not found in response:", response);
        throw new Error("No authentication token found in server response");
      }

      // Decode the JWT token
      const decodedToken = decodeJWT(token);

      if (!decodedToken) {
        throw new Error("Failed to decode authentication token");
      }

      // Map the role and create user object
      const mappedRole = mapRoleNameToUserRole(decodedToken.roleName);

      const user = {
        id: decodedToken.userId,
        name: decodedToken.fullName,
        email: decodedToken.email,
        role: mappedRole,
        avatar: decodedToken.profilePic || undefined,
        phoneNumber: decodedToken.phoneNumber,
        address: decodedToken.address,
        department: decodedToken.department,
        community: decodedToken.community,
        state: decodedToken.state,
        localGovernmentArea: decodedToken.localGovernmentArea,
        status: decodedToken.status,
        assignedProjectId: decodedToken.assignedProjectId,
        roleId: decodedToken.roleId,
      };

      // Login the user with both user object and token
      login(user, token);
      
      sessionStorage.setItem("isAuthenticated", JSON.stringify(true));
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);
    

      // Redirect to dashboard
      // const redirectPath = getDefaultRouteForRole(mappedRole);
      router.push("/dashboard");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      setError(
        error?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[10px] md:border border-[#D0D5DD] bg-white pb-4 pt-8 px-7 w-[450px] h-fit">
      <h4 className="font-semibold text-2xl md:text-[28px] text-gray-900 text-center mb-2">
        Log In
      </h4>
      <p className="text-sm font-normal text-gray-500 text-center">
        Enter your credentials to access your account
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
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

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}

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
          <Button
            content={"Log into Account"}
            onClick={handleLogin}
            isDisabled={isLoading}
            isLoading={isLoading}
          />
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
