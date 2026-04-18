"use client";

import Heading from "@/ui/text-heading";
import AddIndicatorForm from "@/components/team-member-components/add-indicator-form";
import { useSearchParams } from "next/navigation";

export default function AddOutputIndicator() {
  const searchParams = useSearchParams();
  const resultType = searchParams.get("resultType") || "output";

  return (
    <div className="border border-[#E4E7EC] pt-8 px-6 pb-6 rounded-[10px] bg-white w-156">
      <Heading heading="Add Output Indicator" className="text-center" />
      <AddIndicatorForm resultType={resultType} />
    </div>
  );
}
