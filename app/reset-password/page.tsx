import ResetPassword from "@/components/reset-password";
import Logo from "@/ui/logo-component";

export const metadata = {
  title: "Reset Password - NDSICDE",
  description: "Reset your password with quick easy steps",
};

export default function LoginPage() {
  return (
    <section className="flex flex-col justify-center items-center h-screen md:bg-[#F7F9FC] relative">
      <ResetPassword />
      <footer className="flex justify-center items-end absolute bottom-2">
        <Logo />
      </footer>
    </section>
  );
}
