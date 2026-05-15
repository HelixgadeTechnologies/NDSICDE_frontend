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
import { indicatorApi } from "@/lib/api/indicatorApi";
import DisaggregationComponent from "@/ui/disaggregation-component";

const STATUS_OPTIONS = [
  { label: "Not started", value: "Not started" },
  { label: "In progress", value: "In progress" },
  { label: "Completed", value: "Completed" },
];

const DISAGG_TYPES = [
  "Gender & Social Inclusion (Sex)",
  "Age",
  "State",
  "Year",
  "Donor Type",
  "Policy Action Type",
  "Institution Type",
  "Sector",
  "None",
] as const;

function ReportActualValueForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const projectId = params?.id as string;
  const indicatorId = params?.indicatorId as string;
  const token = getToken();

  const [orgKpiId, setOrgKpiId] = useState(searchParams.get("orgKpiId") || "");
  const [resultTypeId, setResultTypeId] = useState(searchParams.get("resultTypeId") || "");

  const [formData, setFormData] = useState({
    indicatorSource: searchParams.get("indicatorSource") || "",
    thematicArea: searchParams.get("thematicArea") || "",
    statement: searchParams.get("statement") || "",
    responsiblePersons: searchParams.get("responsiblePersons")
      ? searchParams.get("responsiblePersons")!.split(",").map((p) => p.trim())
      : [],
    
    definition: "",
    unitOfMeasure: "",
    
    baseLineDate: "",
    cumulativeValue: "",
    baselineNarrative: "",
    
    targetDate: "",
    cumulativeTarget: "",
    targetNarrative: "",

    actualDate: "",
    cumulativeActual: "",
    actualNarrative: "",
    attachmentUrl: "",
  });

  const [disaggCheckboxes, setDisaggCheckboxes] = useState<boolean[]>(Array(9).fill(false));
  type DisaggRow = { category: string; value: string; target: string; actual: string };
  const [disaggRows, setDisaggRows] = useState<Record<string, DisaggRow[]>>({});
  const [actualDisaggItems, setActualDisaggItems] = useState<any[]>([]);

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
          definition: d.definition || "",
          unitOfMeasure: d.unitOfMeasure || "",
          baseLineDate: d.baseLineDate ? d.baseLineDate.split("T")[0] : "",
          cumulativeValue: d.cumulativeValue?.toString() || "",
          baselineNarrative: d.baselineNarrative || "",
          targetDate: d.targetDate ? d.targetDate.split("T")[0] : "",
          cumulativeTarget: d.cumulativeTarget?.toString() || "",
          targetNarrative: d.targetNarrative || "",
        }));

        if (d.IndicatorDisaggregation && d.IndicatorDisaggregation.length > 0) {
           const newCheckboxes = Array(9).fill(false);
           const newRows: Record<string, any[]> = {};
           
           d.IndicatorDisaggregation.forEach((item: any) => {
             const typeIndex = DISAGG_TYPES.findIndex(t => t.toLowerCase() === item.type?.toLowerCase());
             if (typeIndex !== -1) {
                newCheckboxes[typeIndex] = true;
                const typeName = DISAGG_TYPES[typeIndex];
                if (!newRows[typeName]) newRows[typeName] = [];
                newRows[typeName].push({
                   category: item.category,
                   value: item.value?.toString() ?? item.baseline?.toString() ?? "0",
                   target: item.target?.toString() ?? "0",
                   actual: item.actual?.toString() ?? "0",
                });
             }
           });
           setDisaggCheckboxes(newCheckboxes);
           setDisaggRows(newRows);
        }
      })
      .catch((err) => console.error("Failed to fetch indicator data:", err));
  }, [indicatorId]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDisaggregationChange = (items: any[]) => {
    setActualDisaggItems(items);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.actualDate || !formData.cumulativeActual) {
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
          cumulativeActual: formData.unitOfMeasure === "Status"
            ? formData.cumulativeActual
            : Number(formData.cumulativeActual) || 0,
          actualNarrative: formData.actualNarrative,
          attachmentUrl: formData.attachmentUrl,
          status: "Pending",
          indicatorId: indicatorId || "",
          resultTypeId: resultTypeId,
          IndicatorReportDisaggregation: actualDisaggItems.map((item) => ({
            indicatorReportDisaggregationId: "",
            indicatorReportId: "",
            type: item.type,
            category: item.category,
            actual: formData.unitOfMeasure === "Status"
              ? item.actual
              : Number(item.actual) || 0
          }))
        },
        isCreate: true
      };

      const response = await indicatorApi.reportIndicator(payload);

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

  const isStatusType = formData.unitOfMeasure === "Status";

  return (
    <CardComponent>
      <Heading
        heading="Indicator Reporting Format and Attributes"
        className="text-center"
      />
      <form className="space-y-8 my-6" onSubmit={handleSubmit}>
        
        {/* ── Indicator Metadata (Read Only mostly, or just prefilled) */}
        <div className="space-y-4">
          <TextInput
            label="Indicator Source"
            value={formData.indicatorSource}
            name="indicatorSource"
            onChange={() => {}}
            isDisabled
          />
          <TextInput
            label="Thematic Area/Pillar"
            value={formData.thematicArea}
            name="thematicArea"
            onChange={() => {}}
            isDisabled
          />
          <TextInput
            label="Indicator Statement"
            name="statement"
            value={formData.statement}
            onChange={() => {}}
            isDisabled
          />
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Indicator Definition"
              value={formData.definition}
              name="definition"
              onChange={() => {}}
              isDisabled
            />
            <TextInput
              label="Unit of Measurement"
              value={formData.unitOfMeasure}
              name="unitOfMeasure"
              onChange={() => {}}
              isDisabled
            />
          </div>
          <TextInput
            label="Responsible Person(s)"
            value={formData.responsiblePersons.join(", ")}
            name="responsiblePersons"
            onChange={() => {}}
            isDisabled
          />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Baseline Context
            </p>
            <div className="space-y-2">
              <TextInput
                label="Baseline Date"
                value={formData.baseLineDate}
                name="baseLineDate"
                onChange={() => {}}
                isDisabled
              />
              <TextInput
                label="Cumulative Baseline"
                value={formData.cumulativeValue}
                name="cumulativeValue"
                onChange={() => {}}
                isDisabled
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Target Context
            </p>
            <div className="space-y-2">
              <TextInput
                label="Target Date"
                value={formData.targetDate}
                name="targetDate"
                onChange={() => {}}
                isDisabled
              />
              <TextInput
                label="Cumulative Target"
                value={formData.cumulativeTarget}
                name="cumulativeTarget"
                onChange={() => {}}
                isDisabled
              />
            </div>
          </div>
        </div>

        {/* ── Actual (Editable) */}
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-widest">
            Actual
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1.5">
                Actual Date
              </p>
              <DateInput
                value={formData.actualDate}
                onChange={(val) => handleInputChange("actualDate", val)}
              />
            </div>
            {isStatusType ? (
              <DropDown
                label="Cumulative Actual"
                value={formData.cumulativeActual}
                name="cumulativeActual"
                onChange={(v) => handleInputChange("cumulativeActual", v)}
                options={STATUS_OPTIONS}
                placeholder="Select status"
              />
            ) : (
              <TextInput
                label="Cumulative Actual"
                value={formData.cumulativeActual}
                name="cumulativeActual"
                onChange={(e) => handleInputChange("cumulativeActual", e.target.value)}
              />
            )}
          </div>

          <TextareaInput
            label="Actual Narrative"
            value={formData.actualNarrative}
            name="actualNarrative"
            onChange={(e) => handleInputChange("actualNarrative", e.target.value)}
          />

          <DisaggregationComponent
            view="actual"
            isStatusType={isStatusType}
            sharedCheckboxes={disaggCheckboxes}
            sharedRows={disaggRows}
            onRowsChange={setDisaggRows}
            onChange={handleDisaggregationChange}
            cumulativeValue={formData.cumulativeValue}
            cumulativeTarget={formData.cumulativeTarget}
            cumulativeActual={formData.cumulativeActual}
            isReadOnly={false}
          />
        </div>

        <FileUploader 
          token={token ?? undefined}
          onUploadComplete={(url) => handleInputChange("attachmentUrl", url)}
        />
        
        <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
          <Button 
            content="Cancel" 
            isSecondary 
            onClick={() => router.push(`/projects/${projectId}`)}
            type="button"
            isDisabled={isSubmitting}
          />
          <div className="w-full">
              <Button
                content={isSubmitting ? "Submitting..." : "Report Actual"}
                isLoading={isSubmitting}
                onClick={() => {}}
                type="submit"
                isDisabled={isSubmitting}
              />
          </div>
        </div>
      </form>
    </CardComponent>
  );
}

export default function ReportActualValue() {
  return (
    <section className="w-full max-w-4xl pt-8 pb-12 mx-auto">
      <Suspense fallback={<div className="text-center py-10">Loading form...</div>}>
        <ReportActualValueForm />
      </Suspense>
    </section>
  );
}
