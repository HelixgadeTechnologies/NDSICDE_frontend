"use client";

import { useState } from "react";
import TextInput from "@/ui/form/text-input";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import RadioInput from "@/ui/form/radio";
import { useForm } from "@/context/ProjectRequestContext";

type FormTwoProps = {
  onBack?: () => void;
  onNext?: () => void;
};

export default function FormTwo({ onBack, onNext }: FormTwoProps) {
  const { formData, updateFormData, setActiveStep } = useForm();
  
  const [transportMode, setTransportMode] = useState<string>(formData.modeOfTransport || "Road");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Handle radio button changes for transport mode
  const handleTransportModeChange = (value: string) => {
    setTransportMode(value);
    updateFormData({ modeOfTransport: value });
  };

  // Handle date changes
  const handleDateChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveStep(1);
    }
  };

  const handleNext = () => {
    // Validate required fields
    if (!formData.modeOfTransport) {
      alert("Please select mode of transport");
      return;
    }
    
    if (!formData.driverName && transportMode === "Road") {
      alert("Please enter driver's name");
      return;
    }
    
    if (!formData.driversPhoneNumber && transportMode === "Road") {
      alert("Please enter driver's phone number");
      return;
    }
    
    if (!formData.departureTime) {
      alert("Please select departure date");
      return;
    }
    
    if (!formData.route) {
      alert("Please enter route");
      return;
    }
    
    // Save transport mode if not already saved
    if (transportMode && !formData.modeOfTransport) {
      updateFormData({ modeOfTransport: transportMode });
    }
    
    if (onNext) {
      onNext();
    } else {
      setActiveStep(3);
    }
  };

  // Clear driver-related fields if mode is Flight
  const clearDriverFields = () => {
    if (transportMode === "Flight") {
      updateFormData({
        driverName: "",
        driversPhoneNumber: "",
        vehiclePlateNumber: "",
        vehicleColor: "",
      });
    }
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Journey Management" className="text-center" />
        
        <div className="space-y-3">
          <p className="text-sm text-gray-900 font-medium">Mode of Transport *</p>
          <div className="flex items-center gap-6">
            <RadioInput
              label="Road"
              value="Road"
              name="modeOfTransport"
              onChange={() => {
                handleTransportModeChange("Road");
                clearDriverFields();
              }}
              is_checked={transportMode === "Road"}
            />
            <RadioInput
              label="Flight"
              value="Flight"
              name="modeOfTransport"
              onChange={() => {
                handleTransportModeChange("Flight");
                clearDriverFields();
              }}
              is_checked={transportMode === "Flight"}
            />
          </div>
          <p className="text-xs text-gray-500">
            {transportMode === "Road" 
              ? "Please provide vehicle details for road transport"
              : "Flight transport selected - driver details not required"}
          </p>
        </div>
        
        {transportMode === "Road" && (
          <>
            <TextInput
              label="Driver's Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleInputChange}
              placeholder="Enter driver's full name"
            />
            
            <TextInput
              label="Driver's Phone Number"
              name="driversPhoneNumber"
              value={formData.driversPhoneNumber}
              onChange={handleInputChange}
              placeholder="Enter driver's phone number"
            />
            
            <TextInput
              label="Vehicle Plate Number"
              name="vehiclePlateNumber"
              value={formData.vehiclePlateNumber}
              onChange={handleInputChange}
              placeholder="Enter vehicle plate number"
            />
            
            <TextInput
              label="Vehicle Color"
              name="vehicleColor"
              value={formData.vehicleColor}
              onChange={handleInputChange}
              placeholder="Enter vehicle color"
            />
          </>
        )}
        
        <DateInput 
          label="Departure Date" 
          // name="departureTime"
          value={formData.departureTime}
          onChange={(value) => handleDateChange("departureTime", value)}
        />
        
        <TextInput 
          label="Route" 
          name="route" 
          value={formData.route}
          onChange={handleInputChange}
          placeholder="Enter route details"
        />
        
        <TextInput
          label="Recipient's Phone Number"
          name="recipientPhoneNumber"
          value={formData.recipientPhoneNumber}
          onChange={handleInputChange}
          placeholder="Enter recipient's phone number"
        />

        {/* buttons */}
        <div className="flex gap-8 items-center">
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
              isDisabled={!formData.modeOfTransport || !formData.departureTime || !formData.route}
            />
          </div>
        </div>
      </form>
    </section>
  );
}