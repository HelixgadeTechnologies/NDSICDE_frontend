"use client";

import TextInput from "@/ui/form/text-input";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import RadioInput from "@/ui/form/radio";

type FormTwoProps = {
  onBack: () => void;
  onNext: () => void;
};

export default function FormTwo({ onBack, onNext }: FormTwoProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
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

        {/* buttons */}
        <div className="flex gap-8 items-center">
          <div className="w-2/5">
            <Button isSecondary content="Back" onClick={onBack} />
          </div>
          <div className="w-3/5">
            <Button content="Next" onClick={onNext} />
          </div>
        </div>
      </form>
    </section>
  );
}
