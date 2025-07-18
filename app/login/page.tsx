import Login from "@/components/login-component";
import Logo from "@/ui/logo-component";

export const metadata = {
  title: "Login - NDSICDE",
  description: "Login to your account to visit your information",
};

export default function LoginPage() {
  return (
    <section className="flex flex-col justify-center items-center h-screen md:bg-[#F7F9FC] relative">
      <Login />
      <footer className="flex justify-center items-end absolute bottom-2">
        <Logo />
      </footer>
    </section>
  );
}
