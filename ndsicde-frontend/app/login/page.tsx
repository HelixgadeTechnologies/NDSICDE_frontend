import Login from "@/components/login-component"

export const metadata = {
    title: "Login - NDSICDE",
    description:"Login to your account to visit your information",
}

export default function LoginPage() {
    return (
        <section className="flex justify-center items-center h-screen md:bg-[#F7F9FC]">
            <Login />
        </section>
    )
}