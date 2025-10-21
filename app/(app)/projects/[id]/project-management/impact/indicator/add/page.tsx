"use client";

import Heading from "@/ui/text-heading";
import AddIndicatorForm from "@/components/team-member-components/add-indicator-form";

export default function AddImpactIndicator() {
 
  return (
    <div className="border border-[#E4E7EC] pt-8 px-6 pb-6 rounded-[10px] bg-white w-[624px]">
      <Heading heading="Add Impact Indicator" className="text-center" />
      <AddIndicatorForm/>
    </div>
  );
}
