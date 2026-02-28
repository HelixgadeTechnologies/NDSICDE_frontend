"use client";

import TextInput from "@/ui/form/text-input";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import RadioInput from "@/ui/form/radio";
import { toast } from "react-toastify";
import { RequestFormData } from "./page";

type FormTwoProps = {
  onBack: () => void;
  onNext: () => void;
  formData: RequestFormData;
  updateFormData: (data: Partial<RequestFormData>) => void;
};

export default function FormTwo({ onBack, onNext, formData, updateFormData }: FormTwoProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const handleNext = () => {
    if (!formData.modeOfTransport || !formData.driverName || !formData.driversPhoneNumber || !formData.vehiclePlateNumber || !formData.vehicleColor || !formData.departureTime || !formData.route || !formData.recipientPhoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }
    onNext();
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Journey Management" className="text-center" />
        <div className="space-y-1">
          <p className="text-sm text-gray-900 font-medium">Mode of Transport</p>
          <div className="flex items-center gap-6">
            <RadioInput
              label="Road"
              value="Road"
              name="modeOfTransport"
              onChange={(e) => updateFormData({ modeOfTransport: "Road" })}
              is_checked={formData.modeOfTransport === "Road"}
            />
            <RadioInput
              label="Flight"
              value="Flight"
              name="modeOfTransport"
              onChange={(e) => updateFormData({ modeOfTransport: "Flight" })}
              is_checked={formData.modeOfTransport === "Flight"}
            />
          </div>
        </div>
        <TextInput
          label="Driver's Name"
          name="driverName"
          value={formData.driverName}
          onChange={(e) => updateFormData({ driverName: e.target.value })}
        />
        <TextInput
          label="Driver's Phone Number"
          name="driversPhoneNumber"
          value={formData.driversPhoneNumber}
          onChange={(e) => updateFormData({ driversPhoneNumber: e.target.value })}
        />
        <TextInput
          label="Vehicle Plate Number"
          name="vehiclePlateNumber"
          value={formData.vehiclePlateNumber}
          onChange={(e) => updateFormData({ vehiclePlateNumber: e.target.value })}
        />
        <TextInput
          label="Vehicle Color"
          name="vehicleColor"
          value={formData.vehicleColor}
          onChange={(e) => updateFormData({ vehicleColor: e.target.value })}
        />
        <DateInput 
          label="Departure Date" 
          value={formData.departureTime}
          onChange={(val) => updateFormData({ departureTime: val })}
        />
        <TextInput 
          label="Route" 
          name="route" 
          value={formData.route} 
          onChange={(e) => updateFormData({ route: e.target.value })} 
        />
        <TextInput
          label="Recipient's Phone Number"
          name="recipientPhoneNumber"
          value={formData.recipientPhoneNumber}
          onChange={(e) => updateFormData({ recipientPhoneNumber: e.target.value })}
        />

        {/* buttons */}
        <div className="flex gap-8 items-center mt-5">
          <div className="w-2/5">
            <Button isSecondary content="Back" onClick={onBack} />
          </div>
          <div className="w-3/5">
            <Button content="Next" onClick={handleNext} />
          </div>
        </div>
      </form>
    </section>
  );
}
