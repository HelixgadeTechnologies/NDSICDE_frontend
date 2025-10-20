"use client";

import TextInput from "@/ui/form/text-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import FileUploader from "@/ui/form/file-uploader";

type FormThreeProps = {
  onBack: () => void;
  onNext: () => void;
};

export default function FormThree({ onBack, onNext }: FormThreeProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Support Document" className="text-center" />
        <TextInput
          label="Document Name"
          name="documentName"
          value=""
          onChange={() => {}}
        />
        <FileUploader />

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
