"use client";

import { useState, useMemo } from "react";
import Button from "@/ui/form/button";
import TagInput from "@/ui/form/tag-input";
import DropDown from "@/ui/form/select-dropdown";
import stateAndLgaData from "@/lib/config/stateAndLg.json";

type FormTwoProps = {
  onClick: () => void;
  onNext: () => void;
};

export default function FormTwo({ onClick, onNext }: FormTwoProps) {
  const [stateTags, setStateTags] = useState(["Rivers", "Delta"]);
  const [lgaTags, setLgaTags] = useState<string[]>([]);
  const [communityTags, setCommunityTags] = useState<string[]>([]);
  const [thematicTags, setThematicTags] = useState<string[]>([]);
  const [managerTags, setManagerTags] = useState<string[]>([]);

  // Extract all state names from the JSON (excluding "ALL")
  const stateOptions = useMemo(() => {
    return stateAndLgaData
      .filter(item => item.state !== "ALL")
      .map(item => item.state);
  }, []);

  // Get LGAs based on selected states
  const lgaOptions = useMemo(() => {
    if (stateTags.length === 0) {
      return [];
    }
    
    // Find all LGAs for the selected states
    const lgas: string[] = [];
    stateTags.forEach(selectedState => {
      const stateData = stateAndLgaData.find(item => item.state === selectedState);
      if (stateData && stateData.lgas) {
        lgas.push(...stateData.lgas);
      }
    });
    
    // Remove duplicates and return
    return Array.from(new Set(lgas));
  }, [stateTags]);

  const thematicAreas = [
    "Environment",
    "Economic Diversification",
    "Governance",
    "Peace and Security",
    "Organizational Transformation",
    "Strategic Partnership",
  ];

  const handleBack = () => {
    onClick();
  };

  const handleNext = () => {
    onNext();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // When states change, filter out LGAs that no longer belong to selected states
  const handleStateChange = (newStateTags: string[]) => {
    setStateTags(newStateTags);
    
    // Filter existing LGA tags to only keep those that belong to the new selected states
    if (newStateTags.length > 0) {
      const validLgas = new Set<string>();
      newStateTags.forEach(state => {
        const stateData = stateAndLgaData.find(item => item.state === state);
        if (stateData && stateData.lgas) {
          stateData.lgas.forEach(lga => validLgas.add(lga));
        }
      });
      
      setLgaTags(prevLgas => prevLgas.filter(lga => validLgas.has(lga)));
    } else {
      // If no states selected, clear LGAs
      setLgaTags([]);
    }
  };

  return (
    <section>
      <form className="space-y-6 w-full" onSubmit={handleFormSubmit}>
        <TagInput
          label="Target States"
          tags={stateTags}
          options={stateOptions}
          placeholder="Select target states"
          onChange={handleStateChange}
        />
        <TagInput
          label="Target Local Governments"
          placeholder="Select target local governments"
          tags={lgaTags}
          options={lgaOptions}
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
          options={thematicAreas}
        />
        <TagInput
          label="Assigned Project Manager"
          placeholder="Assigned Project Manager"
          tags={managerTags}
          onChange={setManagerTags}
        />
        <DropDown
          label="Strategic Objective"
          placeholder="Strategic Objective"
          onChange={() => {}}
          options={[]}
          name="strategic_objectives"
          value=""
        />
        <DropDown
          value=""
          name="status"
          options={[{label: "Active", value: "Active"}, {label: "Inactive", value: "Inactive"}]}
          onChange={() => {}}
          label="Status"
        />
        <div className="flex gap-6 items-center mt-4">
          <div className="w-2/5">
            <Button 
              isSecondary 
              content="Back" 
              onClick={handleBack}
            />
          </div>
          <div className="w-3/5">
            <Button 
              content="Next" 
              onClick={handleNext}
            />
          </div>
        </div>
      </form>
    </section>
  );
}