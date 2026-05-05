"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import FileUploader from "@/ui/form/file-uploader";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import DropDown from "@/ui/form/select-dropdown";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getToken } from "@/lib/api/credentials";

function ReportActualValueForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const projectId = params?.id as string;
  const indicatorId = params?.indicatorId as string;
  const token = getToken();

  // Seed from query params (fast prefill, used while the fetch is in-flight)
  const [orgKpiId, setOrgKpiId] = useState(searchParams.get("orgKpiId") || "");
  const [resultTypeId, setResultTypeId] = useState(searchParams.get("resultTypeId") || "");

  const [formData, setFormData] = useState({
    indicatorSource: searchParams.get("indicatorSource") || "",
    thematicArea: searchParams.get("thematicArea") || "",
    statement: searchParams.get("statement") || "",
    responsiblePersons: searchParams.get("responsiblePersons")
      ? searchParams.get("responsiblePersons")!.split(",").map((p) => p.trim())
      : [],
    disaggregationType: "",
    actualDate: "",
    cummulativeActual: "",
    actualNarrative: "",
    attachmentUrl: "",
  });

  // Fetch indicator data directly — this is the source of truth.
  // Overrides any partial/missing query param values once the API responds.
  useEffect(() => {
    if (!indicatorId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicators/${indicatorId}`)
      .then((res) => {
        const d = res.data?.data;
        if (!d) return;
        setOrgKpiId(d.orgKpiId || "");
        setResultTypeId((prev) => d.resultTypeId || prev);
        setFormData((prev) => ({
          ...prev,
          indicatorSource: d.indicatorSource || prev.indicatorSource,
          thematicArea: d.thematicAreasOrPillar || prev.thematicArea,
          statement: d.statement || prev.statement,
          responsiblePersons:
            d.responsiblePersons && typeof d.responsiblePersons === "string"
              ? d.responsiblePersons.split(",").map((p: string) => p.trim())
              : prev.responsiblePersons,
        }));
      })
      .catch((err) => console.error("Failed to fetch indicator data:", err));
  }, [indicatorId]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.actualDate || !formData.cummulativeActual) {
      toast.error("Please fill in required fields (Actual Date, Cumulative Actual).");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        payload: {
          indicatorReportId: "",
          indicatorSource: formData.indicatorSource,
          orgKpiId: orgKpiId, 
          thematicAreasOrPillar: formData.thematicArea,
          indicatorStatement: formData.statement,
          responsiblePersons: formData.responsiblePersons.join(", "),
          actualDate: new Date(formData.actualDate).toISOString(),
          cumulativeActual: formData.cummulativeActual,
          actualNarrative: formData.actualNarrative,
          attachmentUrl: formData.attachmentUrl, 
          status: "Pending", 
          indicatorId: indicatorId || "",
          resultTypeId: resultTypeId, 
          IndicatorReportDisaggregation: formData.disaggregationType ? [
            {
              indicatorReportDisaggregationId: "",
              indicatorReportId: "",
              type: formData.disaggregationType,
              category: "",
              actual: Number(formData.cummulativeActual) || 0
            }
          ] : []
        },
        isCreate: true
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicator_report`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        toast.success("Indicator report submitted successfully.");
        router.push(`/projects/${projectId}`);
      } else {
        toast.error("Failed to submit indicator report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred while submitting the report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardComponent>
      <Heading
        heading="Indicator Reporting Format and Attributes"
        className="text-center"
      />
      <form className="space-y-6 my-6" onSubmit={handleSubmit}>
        <TagInput 
          label="Indicator Source" 
          value={formData.indicatorSource ? [formData.indicatorSource] : []}
          onChange={(tags) => handleInputChange("indicatorSource", tags[0] || "")}
        />
        <DropDown 
          label="Thematic Area/Pillar" 
          name="thematicArea"
          value={formData.thematicArea}
          options={THEMATIC_AREAS_OPTIONS}
          onChange={(val) => handleInputChange("thematicArea", val)}
          isBigger
        />
        <TextInput 
          label="Indicator Statement" 
          name="statement"
          value={formData.statement}
          onChange={(e) => handleInputChange("statement", e.target.value)}
          isBigger
        />
        <TagInput 
          label="Responsible Person(s)" 
          value={formData.responsiblePersons}
          onChange={(tags) => handleInputChange("responsiblePersons", tags)}
        />
        <TextInput 
          label="Disaggregation Type" 
          name="disaggregationType"
          value={formData.disaggregationType}
          onChange={(e) => handleInputChange("disaggregationType", e.target.value)}
          isBigger
        />
        <div className="space-y-6">
          <Heading heading="Actual Value (s)" sm />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p className="text-sm font-medium">Actual Date</p>
            <DateInput 
              value={formData.actualDate}
              onChange={(val) => handleInputChange("actualDate", val)}
            />
            <p className="text-sm font-medium">Cummulative Actual</p>
            <TextInput
              name="cummulativeActual"
              value={formData.cummulativeActual}
              onChange={(e) => handleInputChange("cummulativeActual", e.target.value)}
            />
            <p className="text-sm font-medium">Actual Narrative</p>
            <TextareaInput
              name="actualNarrative"
              value={formData.actualNarrative}
              onChange={(e) => handleInputChange("actualNarrative", e.target.value)}
            />
          </div>
        </div>
        <FileUploader 
          token={token ?? undefined}
          onUploadComplete={(url) => handleInputChange("attachmentUrl", url)}
        />
        <div className="flex items-center gap-6">
          <Button 
            content="Cancel" 
            isSecondary 
            onClick={() => router.push(`/projects/${projectId}`)}
            type="button"
          />
          <div className="w-full">
              <Button
                content={"Add"}
                isLoading={isSubmitting}
                onClick={() => {}}
                type="submit"
              />
          </div>
        </div>
      </form>
    </CardComponent>
  );
}

export default function ReportActualValue() {
  return (
    <section className="w-156 pt-8 pb-12">
      <Suspense fallback={<div className="text-center py-10">Loading form...</div>}>
        <ReportActualValueForm />
      </Suspense>
    </section>
  );
}
