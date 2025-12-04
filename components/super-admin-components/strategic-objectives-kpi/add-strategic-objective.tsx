"use client";

import { useStrategicObjectivesAndKPIsState } from "@/store/admin-store/strategic-objectives-kpi-store";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import axios from "axios";
import { FormEvent } from "react";
import { token } from "@/lib/api/credentials";

type AddSOProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddStrategicObjectiveModal({
  isOpen,
  onClose,
}: AddSOProps) {
  const {
    strategicObjectiveStatement,
    thematicAreas,
    pillarLeadEmail,
    setField,
  } = useStrategicObjectivesAndKPIsState();

  const handleSO = async (e: FormEvent) => {
    e.preventDefault();

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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          message: error.response?.data,
          headers: error.response?.headers,
        });
      }
      console.error("Error adding Strategic Objective:", error);
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
            { label: "Health", value: "Health" },
            { label: "Education", value: "Education" },
            { label: "Water & Sanitation", value: "Water & Sanitation" },
            { label: "Economic Development", value: "Economic Development" },
          ]}
        />

        <TextInput
          value={pillarLeadEmail}
          name="pillarLeadEmail"
          label="Pillar Lead (Enter Email Address)"
          onChange={(e) => setField("pillarLeadEmail", e.target.value)}
        />

        <Button content="Add Objective" />
      </form>
    </Modal>
  );
}
