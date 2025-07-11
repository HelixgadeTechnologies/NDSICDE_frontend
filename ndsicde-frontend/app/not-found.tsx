import Button from "@/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCy9XhBD-5oC_4jtm3uRn-RKKM5iLxPDqb9VusmFz5ZJ76vBsMh0a-qSnBt18lz_0J6LPDeCgXA97LMTArjO1Wb5cYS0yaUVdK_orPKAAo_bLuM7MJpN7WUw8tbwDPOWOTsSjuXDnzWgunwEJNAOgg4klCrSLFcMUkeBzdkYa2MRRX89LnnNz-DjyoIMOVUEnP2gqvg1RmzaismrD8jU5u8zNTlmslKSGD1zYXerrdHFLMPYa8mI8QxGpahDWnGzgtM3me6bqTeFZBt)",
      }}
    >
      <div className="flex flex-col items-center text-center px-4">
        <h1 className="text-[#1c0d0e] text-[50px] font-bold mb-2">404</h1>
        <p className="text-[#1c0d0e] text-lg mb-6 font-semibold">
          Oops! The page you&apos;re looking for does not exist.
        </p>
        <Button content="Return to Homepage" href="/login" isSecondary />
        <span className="my-10 text-sm">Having trouble? Contact our <br/> <Link href={"#"} className="text-[var(--primary)] underline">help center</Link></span>
      </div>
    </div>
  );
}
