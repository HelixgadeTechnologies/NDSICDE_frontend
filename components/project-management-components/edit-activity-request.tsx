"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import FileUploader from "@/ui/form/file-uploader";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";
import { useState } from "react";
import DateInput from "@/ui/form/date-input";
import RadioInput from "@/ui/form/radio";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
};

// type FormData = {
//   staff: string;
//   output: string;
//   activityTitle: string;
//   activityBudgetCode: string;
//   activityLocation: string;
//   activityDescription: string;
// };

// Step 1: financial request and retirement

const Step1BasicInfo = () => (
  <div className="space-y-6">
    <Heading heading="Financial Request and Retirement" />
    <TextInput label="Staff" name="staff" value="" onChange={() => {}} />
    <DropDown
      label="Output"
      name="output"
      value=""
      onChange={() => {}}
      options={[]}
    />
    <DropDown
      label="Activity Title"
      name="activityTitle"
      value=""
      onChange={() => {}}
      options={[]}
    />
    <TextInput
      label="Activity Budget Code"
      name="activityBudgetCode"
      value=""
      onChange={() => {}}
    />
    <DropDown
      label="Activity Location(s)"
      name="activityLocation"
      value=""
      onChange={() => {}}
      options={[]}
    />
    <TextareaInput
      label="Activity Purpose/Description"
      name="activityDescription"
      value=""
      onChange={() => {}}
    />
    <div className="flex items-center gap-2">
      <DateInput label="Activity Start Date" />
      <DateInput label="Activity End Date" />
    </div>
    <div className="space-y-2">
      <p className="text-sm primary">Add Budget Line Item</p>
      <TextareaInput
        label="Activity Line Description"
        name="activityLineDescription"
        value=""
        onChange={() => {}}
      />
    </div>
    <TextInput label="Quantity" name="quantity" value="" onChange={() => {}} />
    <TextInput
      label="Frequency"
      name="frequency"
      value=""
      onChange={() => {}}
    />
    <TextInput
      label="Unit Cost (₦)"
      name="unitCost"
      value=""
      onChange={() => {}}
    />
    <TextInput
      label="Budget Code"
      name="budgetCode"
      value=""
      onChange={() => {}}
    />
    <TextInput
      label="Total (₦) - this will automatically Qty*Frq*Unit cost"
      name="total"
      value=""
      onChange={() => {}}
    />
  </div>
);

// Step 2: journey management
const JourneyManagement = () => (
  <div className="space-y-6">
    <Heading heading="Journey Management" />
    <div className="space-y-1">
      <p className="text-sm text-gray-900 font-medium">Mode of Transport</p>
      <div className="flex items-center gap-6">
        <RadioInput
          label="Road"
          value=""
          name="modeOfTransport"
          onChange={() => {}}
          is_checked
        />
        <RadioInput
          label="Flight"
          value=""
          name="modeOfTransport"
          onChange={() => {}}
          is_checked
        />
      </div>
    </div>
    <TextInput
      label="Driver's Name"
      name="driverName"
      value=""
      onChange={() => {}}
    />
    <TextInput
      label="Driver's Phone Name"
      name="driverNumber"
      value=""
      onChange={() => {}}
    />
    <TextInput
      label="Vehicle Plate Number"
      name="vehiclePlateNumber"
      value=""
      onChange={() => {}}
    />
    <TextInput
      label="Vehicle Color"
      name="vehicleColor"
      value=""
      onChange={() => {}}
    />
    <DateInput label="Depature Date" />
    <TextInput label="Route" name="route" value="" onChange={() => {}} />
    <TextInput
      label="Recipient's  Phone Number"
      name="recipientNumber"
      value=""
      onChange={() => {}}
    />
  </div>
);

// Step 3: support document
const SupportDocument = () => (
  <div className="space-y-6">
    <Heading heading="Support Document" />
    <TextInput
      label="Document Name"
      name="documentName"
      value=""
      onChange={() => {}}
    />
    <FileUploader />
  </div>
);

export default function EditActivityRequest({ isOpen, onClose }: EditProps) {
  const [activeStep, setActiveStep] = useState(1);
  //   const [formData, setFormData] = useState({});

  //   const updateFormData = (newData: any) => {
  //     setFormData((prev) => ({ ...prev, ...newData }));
  //   };

  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  //   const handleSubmit = () => {
  //     console.log("Final form data:", formData);
  //     // Handle form submission here
  //     onClose();
  //   };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <JourneyManagement />;
      case 3:
        return <SupportDocument />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <div className="space-y-6">
        {/* Form Content */}
        <div className="h-[550px] custom-scrollbar overflow-y-auto pr-2">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 gap-6">
          <Button
            content={activeStep > 1 ? "Back" : "Cancel"}
            isSecondary
            onClick={activeStep > 1 ? handlePrevious : onClose}
          />
          <Button content="Next" onClick={handleNext} />
        </div>
      </div>
    </Modal>
  );
}
