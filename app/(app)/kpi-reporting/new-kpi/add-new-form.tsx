"use client";

import CardComponent from "@/ui/card-wrapper";
import FileUploader from "@/ui/form/file-uploader";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import { useKPIReportState } from "@/store/partners-store/kpi-report-store";
import { FormEvent, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role-store";
import { useEffect } from "react";
import { getStrategicObjectives } from "@/lib/api/admin-api-calls";
import { useProjects } from "@/context/ProjectsContext";
import { getToken } from "@/lib/api/credentials";

export default function AddNewKPIForm() {
  const router = useRouter();
  const { user } = useRoleStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = getToken();

  const { projectOptions } = useProjects();
  const [objectiveOptions, setObjectiveOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [evidenceUrl, setEvidenceUrl] = useState<string>("");
  const [kpiTypeOptions] = useState<{ label: string; value: string }[]>([
    { label: "Outcome", value: "Outcome" },
    { label: "Output", value: "Output" },
    { label: "Impact", value: "Impact" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStrategicObjectives();
        const options = data.map((obj: any) => ({
          label: obj.statement,
          value: obj.strategicObjectiveId,
        }));
        setObjectiveOptions(options);
      } catch (error) {
        console.error("Error fetching objectives for dropdown: ", error);
      }
    };
    fetchData();
  }, []);

  const {
    strategicObjective,
    projectId,
    kpiName,
    kpiType,
    baseline,
    target,
    actualValue,
    narrative,
    setField,
    resetForm,
  } = useKPIReportState();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const payload = {
        isCreate: true,
        payload: {
          strategicObjectiveId: strategicObjective,
          projectId,
          userId: user?.id,
          kpiName,
          kpiType,
          baseline: baseline ? parseInt(baseline, 10) : undefined,
          target: target ? parseInt(target, 10) : undefined,
          actualValue: actualValue ? parseInt(actualValue, 10) : undefined,
          status: "Pending",
          observation: narrative,
          evidence: evidenceUrl,
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/report`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("KPI Report created successfully!");
        resetForm();
        router.push("/kpi-reporting");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create KPI Report";
      console.error(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardComponent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DropDown
            value={projectId}
            name="projectId"
            label="Project"
            placeholder="Select Project"
            onChange={(val: string) => setField("projectId", val)}
            options={projectOptions}
            isBigger
          />
          <DropDown
            value={strategicObjective}
            name="strategicObjective"
            label="Strategic Objective"
            placeholder="Select Strategic Objective"
            onChange={(value: string) => setField("strategicObjective", value)}
            options={objectiveOptions}
            isBigger
          />
          <TextInput
            value={kpiName}
            name="kpiName"
            label="KPI Name"
            placeholder="Enter KPI Name"
            onChange={(e) => setField("kpiName", e.target.value)}
            isBigger
          />
          <DropDown
            value={kpiType}
            name="kpiType"
            label="KPI Type"
            placeholder="Select KPI Type"
            onChange={(value: string) => setField("kpiType", value)}
            options={kpiTypeOptions}
            isBigger
          />
          <TextInput
            value={baseline}
            name="baseline"
            label="Baseline"
            placeholder="Enter Baseline"
            onChange={(e) => setField("baseline", e.target.value)}
            isBigger
          />
          <TextInput
            value={target}
            name="target"
            label="Target"
            placeholder="Enter Target"
            onChange={(e) => setField("target", e.target.value)}
            isBigger
          />
          <TextInput
            value={actualValue}
            name="actualValue"
            label="Actual Value"
            placeholder="Enter Actual Value"
            onChange={(e) => setField("actualValue", e.target.value)}
            isBigger
          />
        </div>
        <TextareaInput
          label="Narrative/Observations"
          value={narrative}
          name="narrative"
          placeholder="Provide context or explanations for the KPI values"
          onChange={(e) => setField("narrative", e.target.value)}
        />
        <Heading
          heading="Supporting Evidence"
          subtitle="Attach files to support your activity report"
        />
        <FileUploader
          onUploadComplete={(url) => setEvidenceUrl(url)}
          autoUpload={true}
          token={token ?? undefined}
          maxFiles={1}
        />
        <div className="w-[290px] mx-auto">
          <Button
            content={isSubmitting ? "Submitting..." : "Submit KPI Report"}
            icon="fluent:clipboard-bullet-list-ltr-16-regular"
            isDisabled={isSubmitting}
          />
        </div>
      </form>
    </CardComponent>
  );
}
