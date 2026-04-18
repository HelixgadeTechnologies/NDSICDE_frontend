"use client";

import Heading from "@/ui/text-heading";
import AddIndicatorForm from "@/components/team-member-components/add-indicator-form";
import { useSearchParams } from "next/navigation";

// Maps a resultType string from the URL to a human-readable label. 
// e.g. "impact" → "Impact", "outcome" → "Outcome", "output" → "Output" 
function getResultLabel(resultType: string): string {
  const labels: Record<string, string> = {
    impact: "Impact",
    outcome: "Outcome",
    output: "Output",
  };
  return labels[resultType.toLowerCase()] ?? resultType;
}

/* Shared indicator page used by impact, outcome, and output.
 * Expected URL params: 
 *  - resultType : "impact" | "outcome" | "output" — determines heading + resultTypeId lookup
 *  - resultId   : <uuid>                            — the actual impact/outcome/output entity ID
 *                 that maps to the `result` field in the payload
 *  - mode       : "add" | "view" (default: "add")  — whether we are creating or viewing 
 * Examples:
 *  /projects/123/project-management/indicator?resultType=impact&resultId=uuid-abc&mode=add
 *  /projects/123/project-management/indicator?resultType=outcome&resultId=uuid-xyz&mode=view
 */
export default function IndicatorPage() {
  const searchParams = useSearchParams();

  const resultType = searchParams.get("resultType") ?? "impact";
  const resultId = searchParams.get("resultId") ?? "";
  const mode = searchParams.get("mode") ?? "add";

  const resultLabel = getResultLabel(resultType);
  const headingText =
    mode === "view"
      ? `View ${resultLabel} Indicator`
      : `Add ${resultLabel} Indicator`;

  return (
    <div className="border border-[#E4E7EC] pt-8 px-6 pb-6 rounded-[10px] bg-white w-156">
      <Heading heading={headingText} className="text-center" />
      <AddIndicatorForm resultType={resultType} resultId={resultId} />
    </div>
  );
}
