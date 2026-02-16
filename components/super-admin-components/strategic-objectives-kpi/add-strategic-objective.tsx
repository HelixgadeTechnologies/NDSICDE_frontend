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
import { THEMATIC_AREAS } from "@/lib/config/admin-settings";

type AddSOProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

export default function AddStrategicObjectiveModal({
  isOpen,
  onClose,
  onSubmit,
}: AddSOProps) {
  const {
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
      isCreate: true,
      data: {
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

      console.log("Strategic Objective added:", res.data);

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
      console.error("Error adding Strategic Objective:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="550px">
      <Heading
        heading="Add New Strategic Objective"
        subtitle="Create a new strategic objective for your organization, make sure it’s specific, measurable and aligned with your overall goals."
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
          options={[
            {label: "Economic Diversification", value: "Economic Diversification"},
            {label: "Environment and Climate Change", value: "Environment and Climate Change"},
            {label: "Governance", value: "Governance"},
            {label: "Peace and Security", value: "Peace and Security"},
            {label: "Cross-Cutting", value: "Cross-Cutting"},
            {label: "Organizational transformation", value: "Organizational transformation"},
          ]}
        />

        <TextInput
          value={pillarLeadEmail}
          name="pillarLeadEmail"
          label="Pillar Lead (Enter Email Address)"
          onChange={(e) => setField("pillarLeadEmail", e.target.value)}
        />

        <Button content="Add Objective" isLoading={isSending} />
      </form>
    </Modal>
  );
}
