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
  const reportId = searchParams.get("reportId") || "";
  const isEditMode = !!reportId;
  const token = getToken();

  const [orgKpiId, setOrgKpiId] = useState(searchParams.get("orgKpiId") || "");
  const [resultTypeId, setResultTypeId] = useState(searchParams.get("resultTypeId") || "");

  const [formData, setFormData] = useState({
    indicatorSource: searchParams.get("indicatorSource") || "",
    thematicArea: searchParams.get("thematicArea") || "",
    statement: searchParams.get("statement") || "",
    responsiblePersons: searchParams.get("responsiblePersons")
      ? searchParams.get("responsiblePersons")!.split(",").map((p: any) => p.trim())
      : [],
    
    definition: searchParams.get("definition") || "",
    unitOfMeasure: searchParams.get("unitOfMeasure") || "",
    
    baseLineDate: searchParams.get("baseLineDate") ? searchParams.get("baseLineDate")!.split("T")[0] : "",
    cumulativeValue: searchParams.get("cumulativeValue") || "",
    baselineNarrative: "",
    
    targetDate: searchParams.get("targetDate") ? searchParams.get("targetDate")!.split("T")[0] : "",
    cumulativeTarget: searchParams.get("cumulativeTarget") || "",
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
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicators/${indicatorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const d = res.data?.data;
        if (!d) return;
        
        // Handle both object and array responses
        const currentIndicator = Array.isArray(d) 
          ? (d.find((item: any) => item.indicatorId === indicatorId) || d[0])
          : d;
          
        if (!currentIndicator) return;

        setOrgKpiId(currentIndicator.orgKpiId || "");
        setResultTypeId((prev) => currentIndicator.resultTypeId || prev);
        
        setFormData((prev) => ({
          ...prev,
          indicatorSource: currentIndicator.indicatorSource || prev.indicatorSource,
          thematicArea: currentIndicator.thematicAreasOrPillar || prev.thematicArea,
          statement: currentIndicator.statement || prev.statement,
          responsiblePersons:
            currentIndicator.responsiblePersons && typeof currentIndicator.responsiblePersons === "string"
              ? currentIndicator.responsiblePersons.split(",").map((p: string) => p.trim())
              : prev.responsiblePersons,
          definition: currentIndicator.definition || prev.definition,
          unitOfMeasure: currentIndicator.unitOfMeasure || prev.unitOfMeasure,
          baseLineDate: currentIndicator.baseLineDate ? currentIndicator.baseLineDate.split("T")[0] : prev.baseLineDate,
          cumulativeValue: currentIndicator.cumulativeValue?.toString() || prev.cumulativeValue,
          baselineNarrative: currentIndicator.baselineNarrative || prev.baselineNarrative,
          targetDate: currentIndicator.targetDate ? currentIndicator.targetDate.split("T")[0] : prev.targetDate,
          cumulativeTarget: currentIndicator.cumulativeTarget?.toString() || prev.cumulativeTarget,
          targetNarrative: currentIndicator.targetNarrative || prev.targetNarrative,
        }));

        if (currentIndicator.IndicatorDisaggregation && currentIndicator.IndicatorDisaggregation.length > 0) {
           const newCheckboxes = Array(9).fill(false);
           const newRows: Record<string, any[]> = {};
           
           currentIndicator.IndicatorDisaggregation.forEach((item: any) => {
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
  }, [indicatorId, token]);

  // When editing, fetch the existing report and prefill the actual values
  useEffect(() => {
    if (!isEditMode || !indicatorId) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicator_report/${indicatorId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        const payload = res.data;
        const reports = Array.isArray(payload) ? payload : payload?.data ?? [];
        const report = reports.find(
          (r: any) => r.indicatorReportId === reportId,
        );
        if (!report) return;

        setFormData((prev) => ({
          ...prev,
          actualDate: report.actualDate
            ? report.actualDate.split("T")[0]
            : prev.actualDate,
          cumulativeActual:
            report.cumulativeActual?.toString() ?? prev.cumulativeActual,
          actualNarrative: report.actualNarrative ?? prev.actualNarrative,
          attachmentUrl: report.attachmentUrl ?? prev.attachmentUrl,
        }));

        if (
          Array.isArray(report.IndicatorReportDisaggregation) &&
          report.IndicatorReportDisaggregation.length > 0
        ) {
          setActualDisaggItems(report.IndicatorReportDisaggregation);
        }
      })
      .catch((err) =>
        console.error("Failed to fetch existing report for edit:", err),
      );
  }, [isEditMode, reportId, indicatorId, token]);

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
          projectId: projectId,
          indicatorReportId: isEditMode ? reportId : "",
          indicatorSource: formData.indicatorSource,
          orgKpiId: orgKpiId,
          thematicAreasOrPillar: formData.thematicArea,
          indicatorStatement: formData.statement,
          responsiblePersons: formData.responsiblePersons.join(", "),
          actualDate: new Date(formData.actualDate).toISOString(),
          cumulativeActual: formData.unitOfMeasure === "Status"
            ? formData.cumulativeActual
            : String(formData.cumulativeActual) || "",
          actualNarrative: formData.actualNarrative,
          attachmentUrl: formData.attachmentUrl,
          status: "PENDING",
          indicatorId: indicatorId || "",
          resultTypeId: resultTypeId,
          IndicatorReportDisaggregation: actualDisaggItems.map((item) => ({
            indicatorReportDisaggregationId: item.indicatorReportDisaggregationId || "",
            indicatorReportId: isEditMode ? reportId : "",
            type: item.type,
            category: item.category,
            actual: formData.unitOfMeasure === "Status"
              ? item.actual
              : Number(item.actual) || 0
          }))
        },
        isCreate: !isEditMode
      };

      const response = await indicatorApi.reportIndicator(payload);

      if (response.success) {
        toast.success(
          isEditMode
            ? "Indicator report updated successfully."
            : "Indicator report submitted successfully.",
        );
        router.push(
          `/projects/${projectId}/project-management/indicator/${indicatorId}/view`,
        );
      } else {
        toast.error(response.message || "Failed to submit indicator report.");
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
        heading={
          isEditMode
            ? "Edit Indicator Report"
            : "Indicator Reporting Format and Attributes"
        }
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
            placeholder="N/A"
            isDisabled
          />
          <TextInput
            label="Thematic Area/Pillar"
            value={formData.thematicArea}
            name="thematicArea"
            onChange={() => {}}
            placeholder="N/A"
            isDisabled
          />
          <TextInput
            label="Indicator Statement"
            name="statement"
            value={formData.statement}
            onChange={() => {}}
            placeholder="N/A"
            isDisabled
          />
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Indicator Definition"
              value={formData.definition}
              name="definition"
              onChange={() => {}}
              placeholder="N/A"
              isDisabled
            />
            <TextInput
              label="Unit of Measurement"
              value={formData.unitOfMeasure}
              name="unitOfMeasure"
              onChange={() => {}}
              placeholder="N/A"
              isDisabled
            />
          </div>
          <TextInput
            label="Responsible Person(s)"
            value={formData.responsiblePersons.join(", ")}
            name="responsiblePersons"
            onChange={() => {}}
            placeholder="N/A"
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
                placeholder="N/A"
                isDisabled
              />
              <TextInput
                label="Cumulative Baseline"
                value={formData.cumulativeValue}
                name="cumulativeValue"
                onChange={() => {}}
                placeholder="N/A"
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
                placeholder="N/A"
                isDisabled
              />
              <TextInput
                label="Cumulative Target"
                value={formData.cumulativeTarget}
                name="cumulativeTarget"
                onChange={() => {}}
                placeholder="N/A"
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
                content={
                  isSubmitting
                    ? isEditMode
                      ? "Saving..."
                      : "Submitting..."
                    : isEditMode
                    ? "Save Changes"
                    : "Report Actual"
                }
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
