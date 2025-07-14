
"use client";

import { usePathname } from "next/navigation";
import { breadcrumbs } from "@/lib/config/breadcrumbs";

type Props = {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
};

export default function Breadcrumb({
  fallbackTitle = "NDSICDE Platform",
}: Props) {
  const pathname = usePathname();

  const matched = breadcrumbs.find((item) =>
    pathname.startsWith(item.href.replace(/\[.*?\]/, ""))
  );

  return (
    <section className="">
      <div>
        <h2 className="font-bold text-base md:text-[23px] text-[#242424]">
          {matched?.header || fallbackTitle}
        </h2>
      </div>
    </section>
  );
}
