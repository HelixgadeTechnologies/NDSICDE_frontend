"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import FileUploader from "@/ui/form/file-uploader";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Button from "@/ui/form/button";
import { useKPIReportState } from "@/store/partners-store/kpi-report-store";
import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRoleStore } from "@/store/role-store";
import { getStrategicObjectives } from "@/lib/api/admin-api-calls";
import { useProjects } from "@/context/ProjectsContext";
import { getToken } from "@/lib/api/credentials";

type EditKPIModalProps = {
  isOpen: boolean;
  onClose: () => void;
  kpiId: string;
  onEdit: () => void;
};

export default function EditKPIModal({
  isOpen,
  onClose,
  kpiId,
  onEdit,
}: EditKPIModalProps) {
  const { user } = useRoleStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await getStrategicObjectives();
        if (isMounted) {
          const options = data.map((obj: any) => ({
            label: obj.statement,
            value: obj.strategicObjectiveId,
          }));
          setObjectiveOptions(options);
        }
      } catch (error) {
        console.error("Error fetching objectives for dropdown: ", error);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchExistingKPI = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/report/${kpiId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const currentKPI = response.data.data;

        if (currentKPI && isMounted) {
          setField("kpiName", currentKPI.kpiName || "");
          setField("kpiType", currentKPI.kpiType || "");
          setField("baseline", currentKPI.baseline?.toString() || "");
          setField("target", currentKPI.target?.toString() || "");
          setField("actualValue", currentKPI.actualValue?.toString() || "");
          setField(
            "narrative",
            currentKPI.observation || currentKPI.narrative || "",
          );
          setField(
            "projectId",
            currentKPI.project?.projectId || currentKPI.projectId || "",
          );
          setField(
            "strategicObjective",
            currentKPI.strategicObjective?.strategicObjectiveId ||
              currentKPI.strategicObjectiveId ||
              "",
          );
          if (currentKPI.evidence) setEvidenceUrl(currentKPI.evidence);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load KPI details");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (kpiId && token && isOpen) {
      fetchExistingKPI();
    }
    return () => {
      isMounted = false;
    };
  }, [kpiId, token, isOpen, setField]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        isCreate: false,
        kpiReportId: kpiId,
        payload: {
          kpiReportId: kpiId,
          strategicObjectiveId: strategicObjective,
          projectId,
          userId: user?.id,
          kpiName,
          kpiType,
          baseline: baseline ? parseInt(baseline as string, 10) : undefined,
          target: target ? parseInt(target as string, 10) : undefined,
          actualValue: actualValue
            ? parseInt(actualValue as string, 10)
            : undefined,
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
        toast.success("KPI Report updated successfully!");
        resetForm();
        onEdit();
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update KPI Report";
      console.error(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      maxWidth="850px">
      <Heading
        heading="Edit KPI Report"
        subtitle="Update the details about your KPI"
      />
      <div className="h-130 overflow-auto custom-scrollbar">
        {loading ? (
          <div className="dots my-20 mx-auto">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
                onChange={(value: string) =>
                  setField("strategicObjective", value)
                }
                options={objectiveOptions}
                isBigger
              />
              <TextInput
                value={kpiName}
                name="kpiName"
                label="KPI Name"
                placeholder="Enter KPI Name"
                onChange={(e: any) => setField("kpiName", e.target.value)}
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
                onChange={(e: any) => setField("baseline", e.target.value)}
                isBigger
              />
              <TextInput
                value={target}
                name="target"
                label="Target"
                placeholder="Enter Target"
                onChange={(e: any) => setField("target", e.target.value)}
                isBigger
              />
              <TextInput
                value={actualValue}
                name="actualValue"
                label="Actual Value"
                placeholder="Enter Actual Value"
                onChange={(e: any) => setField("actualValue", e.target.value)}
                isBigger
              />
            </div>
            <TextareaInput
              label="Narrative/Observations"
              value={narrative}
              name="narrative"
              placeholder="Provide context or explanations for the KPI values"
              onChange={(e: any) => setField("narrative", e.target.value)}
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
              // Add existing evidence URL if needed
            />
            <div className="w-[290px] mx-auto mt-6">
              <Button
                content={isSubmitting ? "Submitting..." : "Update KPI Report"}
                icon="fluent:clipboard-bullet-list-ltr-16-regular"
                isDisabled={isSubmitting}
              />
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
