"use client";

import { useStrategicObjectivesAndKPIsState } from "@/store/super-admin-store/strategic-objectives-kpi-store";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import axios from "axios";
import { FormEvent, useState } from "react";
import { getToken } from "@/lib/api/credentials";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";

type AddSOProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  mode?: "Add" | "Edit";
};

export default function AddStrategicObjectiveModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "Add",
}: AddSOProps) {
  const {
    strategicObjectiveId,
    strategicObjectiveStatement,
    thematicAreas,
    pillarLeadEmail,
    setField,
  } = useStrategicObjectivesAndKPIsState();
  const [isSending, setIsSending] = useState(false);

  const handleSO = async (e: FormEvent) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      console.error("No token found in localStorage under 'role-storage'");
      return;
    }

    const payload = {
      isCreate: mode === "Add",
      data: {
        strategicObjectiveId: mode === "Edit" ? strategicObjectiveId : undefined,
        statement: strategicObjectiveStatement,
        thematicAreas,
        pillarLead: pillarLeadEmail,
        status: "Active",
      },
    };
    setIsSending(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/strategic-objective`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      onClose();
      if (onSubmit) onSubmit();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          message: error.response?.data,
          headers: error.response?.headers,
        });
      }
      console.error(`Error ${mode === "Add" ? "adding" : "updating"} Strategic Objective:`, error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="550px">
      <Heading
        heading={mode === "Add" ? "Add New Strategic Objective" : "Edit Strategic Objective"}
        subtitle={
          mode === "Add"
            ? "Create a new strategic objective for your organization, make sure it’s specific, measurable and aligned with your overall goals."
            : "Update the details of your strategic objective to ensure it remains aligned with your organizational goals."
        }
      />
      <form onSubmit={handleSO} className="space-y-5 mt-4">
        <TextInput
          value={strategicObjectiveStatement}
          name="strategicObjectiveStatement"
          label="Strategic Objective (SO) Statement"
          onChange={(e) =>
            setField("strategicObjectiveStatement", e.target.value)
          }
        />

        <DropDown
          value={thematicAreas}
          name="thematicAreas"
          label="Select Thematic Areas"
          placeholder="All Thematic Areas"
          onChange={(value: string) => setField("thematicAreas", value)}
          options={THEMATIC_AREAS_OPTIONS}
        />

        <TextInput
          value={pillarLeadEmail}
          name="pillarLeadEmail"
          label="Pillar Lead (Enter Email Address)"
          onChange={(e) => setField("pillarLeadEmail", e.target.value)}
        />

        <Button
          content={mode === "Add" ? "Add Objective" : "Update Objective"}
          isLoading={isSending}
        />
      </form>
    </Modal>
  );
}

