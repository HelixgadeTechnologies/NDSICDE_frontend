"use client";

import { useState } from "react";
import Button from "@/ui/form/button";
import TagInput from "@/ui/form/tag-input";

type FormTwoProps = {
  onClick: () => void;
  onNext: () => void; // New prop for opening modal
};

export default function FormTwo({ onClick, onNext }: FormTwoProps) {
  const [stateTags, setStateTags] = useState(["Rivers", "Delta"]);
  const [lgaTags, setLgaTags] = useState([""]);
  const [communityTags, setCommunityTags] = useState([""]);
  const [thematicTags, setThematicTags] = useState([""]);
  const [managerTags, setManagerTags] = useState([""]);
  const [objectiveTags, setObjectiveTags] = useState([""]);
  const [statusTags, setStatusTags] = useState([""]);

  const nigerianStates = [
    "Rivers",
    "Delta",
    "Lagos",
    "Kano",
    "Kaduna",
    "Oyo",
    "Cross River",
    "Akwa Ibom",
    "Bayelsa",
    "Edo",
    "Ondo",
    "Osun",
    "Ogun",
    "Ekiti",
  ];

  return (
    <section>
      <form action="" className="space-y-6 w-full">
        <TagInput
          label="Target States"
          tags={stateTags}
          options={nigerianStates}
          placeholder="Target States"
          onChange={setStateTags}
        />
        <TagInput
          label="Target Local Governments"
          placeholder="Target Local Governments"
          tags={lgaTags}
          onChange={setLgaTags}
        />
        <TagInput
          label="Target Communities"
          placeholder="Target Communities"
          tags={communityTags}
          onChange={setCommunityTags}
        />
        <TagInput
          label="Project Thematic Area(s) or Pillar(s)"
          placeholder="Project Thematic Area(s) or Pillar(s)"
          tags={thematicTags}
          onChange={setThematicTags}
        />
        <TagInput
          label="Assigned Project Manager"
          placeholder="Assigned Project Manager"
          tags={managerTags}
          onChange={setManagerTags}
        />
        <TagInput
          label="Strategic Objective"
          placeholder="Strategic Objective"
          tags={objectiveTags}
          onChange={setObjectiveTags}
        />
        <TagInput
          label="Status"
          tags={statusTags}
          onChange={setStatusTags}
          placeholder="Active"
        />
        <div className="flex gap-6 items-center mt-4">
          <div className="w-2/5">
            <Button isSecondary content="Back" onClick={onClick} />
          </div>
          <div className="w-3/5">
            <Button content="Next" onClick={onNext} />
          </div>
        </div>
      </form>
    </section>
  );
}