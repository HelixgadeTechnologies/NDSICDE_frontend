"use client";

import { useStrategicObjectivesAndKPIsState } from "@/store/admin-store/strategic-objectives-kpi-store";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="550px">
      <Heading
        heading="Add New Strategic Objective"
        subtitle="Create a new strategic objective for your organization, make sure it’s specific, measurable and aligned with your overall goals."
      />
      <form action="" className="space-y-5 mt-4">
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
          options={[]}
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
