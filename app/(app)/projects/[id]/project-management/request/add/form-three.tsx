"use client";

import TextInput from "@/ui/form/text-input";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import RadioInput from "@/ui/form/radio";
import TextareaInput from "@/ui/form/textarea";
import { toast } from "react-toastify";
import { RequestFormData } from "./page";
import { Icon } from "@iconify/react";

type FormThreeProps = {
  onBack: () => void;
  onNext: () => void;
  formData: RequestFormData;
  updateFormData: (data: Partial<RequestFormData>) => void;
};

export default function FormThree({ onBack, onNext, formData, updateFormData }: FormThreeProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const handleAddPersonnel = () => {
    updateFormData({
      otherPersonnel: [
        ...(formData.otherPersonnel || []),
        { name: "", company: "", phoneNumber: "" }
      ]
    });
  };

  const handleRemovePersonnel = (index: number) => {
    const newList = (formData.otherPersonnel || []).filter((_, i) => i !== index);
    updateFormData({ otherPersonnel: newList });
  };

  const handlePersonnelChange = (index: number, field: "name" | "company" | "phoneNumber", value: string) => {
    const newList = [...(formData.otherPersonnel || [])];
    newList[index] = { ...newList[index], [field]: value };
    updateFormData({ otherPersonnel: newList });
  };

  const handleNext = () => {
    // 1. Common validation
    if (!formData.purposeOfTrip) {
      toast.error("Please fill in the purpose of trip.");
      return;
    }
    if (
      !formData.departureDate ||
      !formData.departureLocationAndTime ||
      !formData.destination ||
      !formData.contactPersonPhoneNumberAtDestination ||
      !formData.route
    ) {
      toast.error("Please fill in all required travel details.");
      return;
    }

    // 2. Road specific validation
    if (formData.modeOfTransport === "Road") {
      if (
        !formData.driverName ||
        !formData.driversPhoneNumber ||
        !formData.vehicleMake ||
        !formData.vehicleModel ||
        !formData.vehiclePlateNumber ||
        !formData.vehicleColor
      ) {
        toast.error("Please fill in all required driver and vehicle details.");
        return;
      }
    }

    // 3. Flight specific validation
    if (formData.modeOfTransport === "Flight") {
      if (
        !formData.flightDepartureState ||
        !formData.flightDepartureTime ||
        !formData.flightArrivalState ||
        !formData.flightArrivalTime ||
        !formData.hotelAccommodationName ||
        !formData.hotelAddress ||
        !formData.returnDate ||
        !formData.returnTime ||
        !formData.airportDropoffOfficerName ||
        !formData.airportPickupOfficerName
      ) {
        toast.error("Please fill in all required flight details.");
        return;
      }
    }

    onNext();
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Journey Management" className="text-center" />

        {/* Purpose of trip */}
        <TextareaInput
          label="Purpose of Trip"
          name="purposeOfTrip"
          value={formData.purposeOfTrip}
          onChange={(e) => updateFormData({ purposeOfTrip: e.target.value })}
          placeholder="Explain the purpose of the trip..."
        />

        {/* Mode of Transport */}
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

        {/* Road Specific Fields: Driver & Vehicle details */}
        {formData.modeOfTransport === "Road" && (
          <>
            {/* Driver Details */}
            <div className="space-y-4 pt-2">
              <Heading heading="Driver Details" sm className="border-b border-gray-100 pb-2 text-[#D2091E]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Driver's Name"
                  name="driverName"
                  value={formData.driverName}
                  onChange={(e) => updateFormData({ driverName: e.target.value })}
                  placeholder="Enter driver's name"
                />
                <TextInput
                  label="Driver's Phone Number"
                  name="driversPhoneNumber"
                  value={formData.driversPhoneNumber}
                  onChange={(e) => updateFormData({ driversPhoneNumber: e.target.value })}
                  placeholder="Enter driver's phone number"
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4 pt-2">
              <Heading heading="Vehicle Details" sm className="border-b border-gray-100 pb-2 text-[#D2091E]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Vehicle Make"
                  name="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={(e) => updateFormData({ vehicleMake: e.target.value })}
                  placeholder="e.g. Toyota"
                />
                <TextInput
                  label="Vehicle Model"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => updateFormData({ vehicleModel: e.target.value })}
                  placeholder="e.g. Hilux"
                />
                <TextInput
                  label="Registration Number"
                  name="vehiclePlateNumber"
                  value={formData.vehiclePlateNumber}
                  onChange={(e) => updateFormData({ vehiclePlateNumber: e.target.value })}
                  placeholder="e.g. ABJ123CD"
                />
                <TextInput
                  label="Vehicle Color"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={(e) => updateFormData({ vehicleColor: e.target.value })}
                  placeholder="e.g. White"
                />
              </div>
            </div>
          </>
        )}

        {/* Flight Specific Fields */}
        {formData.modeOfTransport === "Flight" && (
          <div className="space-y-4 pt-2">
            <Heading heading="Flight Details" sm className="border-b border-gray-100 pb-2 text-[#D2091E]" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Departure State"
                name="flightDepartureState"
                value={formData.flightDepartureState}
                onChange={(e) => updateFormData({ flightDepartureState: e.target.value })}
                placeholder="Enter departure state"
              />
              <TextInput
                label="Departure Time"
                name="flightDepartureTime"
                value={formData.flightDepartureTime}
                onChange={(e) => updateFormData({ flightDepartureTime: e.target.value })}
                placeholder="e.g. 08:30 AM"
              />
              <TextInput
                label="Arrival State"
                name="flightArrivalState"
                value={formData.flightArrivalState}
                onChange={(e) => updateFormData({ flightArrivalState: e.target.value })}
                placeholder="Enter arrival state"
              />
              <TextInput
                label="Arrival Time"
                name="flightArrivalTime"
                value={formData.flightArrivalTime}
                onChange={(e) => updateFormData({ flightArrivalTime: e.target.value })}
                placeholder="e.g. 10:00 AM"
              />
              <div className="md:col-span-2">
                <TextInput
                  label="Hotel Accommodation Name"
                  name="hotelAccommodationName"
                  value={formData.hotelAccommodationName}
                  onChange={(e) => updateFormData({ hotelAccommodationName: e.target.value })}
                  placeholder="Enter hotel name"
                />
              </div>
              <div className="md:col-span-2">
                <TextareaInput
                  label="Address of Hotel"
                  name="hotelAddress"
                  value={formData.hotelAddress}
                  onChange={(e) => updateFormData({ hotelAddress: e.target.value })}
                  placeholder="Enter complete hotel address..."
                />
              </div>
              <DateInput
                label="Return Date"
                value={formData.returnDate}
                onChange={(val) => updateFormData({ returnDate: val })}
              />
              <TextInput
                label="Return Time"
                name="returnTime"
                value={formData.returnTime}
                onChange={(e) => updateFormData({ returnTime: e.target.value })}
                placeholder="e.g. 04:00 PM"
              />
              <TextInput
                label="Airport Drop-off Officer Name"
                name="airportDropoffOfficerName"
                value={formData.airportDropoffOfficerName}
                onChange={(e) => updateFormData({ airportDropoffOfficerName: e.target.value })}
                placeholder="Enter drop-off officer name"
              />
              <TextInput
                label="Airport Pick-up Officer Name"
                name="airportPickupOfficerName"
                value={formData.airportPickupOfficerName}
                onChange={(e) => updateFormData({ airportPickupOfficerName: e.target.value })}
                placeholder="Enter pick-up officer name"
              />
            </div>
          </div>
        )}

        {/* Other Personnel Travelling (Optional) */}
        <div className="space-y-4 pt-2">
          <Heading heading="Other Personnel Travelling (Optional)" sm className="border-b border-gray-100 pb-2 text-[#D2091E]" />
          
          {(formData.otherPersonnel || []).map((person, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase">Personnel #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePersonnel(index)}
                  className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <Icon icon="mdi:close-circle" className="text-lg" /> Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput
                  label="Name"
                  name={`personnel-name-${index}`}
                  value={person.name}
                  onChange={(e) => handlePersonnelChange(index, "name", e.target.value)}
                  placeholder="Enter name"
                />
                <TextInput
                  label="Company"
                  name={`personnel-company-${index}`}
                  value={person.company}
                  onChange={(e) => handlePersonnelChange(index, "company", e.target.value)}
                  placeholder="Enter company"
                />
                <TextInput
                  label="Phone Number"
                  name={`personnel-phone-${index}`}
                  value={person.phoneNumber}
                  onChange={(e) => handlePersonnelChange(index, "phoneNumber", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPersonnel}
            className="text-sm flex items-center gap-1 text-[#D2091E] font-medium hover:text-[#a00014] transition-colors"
          >
            <Icon icon="mdi:plus" className="text-lg" /> Add Personnel
          </button>
        </div>

        {/* Travel Details */}
        <div className="space-y-4 pt-2">
          <Heading heading="Travel Details" sm className="border-b border-gray-100 pb-2 text-[#D2091E]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput 
              label="Departure Date" 
              value={formData.departureDate}
              onChange={(val) => updateFormData({ departureDate: val })}
            />
            <TextInput 
              label="Departure Location & Time" 
              name="departureLocationAndTime" 
              value={formData.departureLocationAndTime} 
              onChange={(e) => updateFormData({ departureLocationAndTime: e.target.value })} 
              placeholder="e.g. Abuja Head Office, 07:00 AM"
            />
            <TextInput 
              label="Destination" 
              name="destination" 
              value={formData.destination} 
              onChange={(e) => updateFormData({ destination: e.target.value })} 
              placeholder="e.g. Kaduna Field Office"
            />
            <TextInput
              label="Contact Person Phone Number at Destination"
              name="contactPersonPhoneNumberAtDestination"
              value={formData.contactPersonPhoneNumberAtDestination}
              onChange={(e) => updateFormData({ contactPersonPhoneNumberAtDestination: e.target.value })}
              placeholder="Enter contact number"
            />
            <div className="md:col-span-2">
              <TextInput 
                label="Intended Route" 
                name="route" 
                value={formData.route} 
                onChange={(e) => updateFormData({ route: e.target.value })} 
                placeholder="e.g. Abuja - Lokoja - Okene Highway"
              />
            </div>
          </div>
        </div>

        {/* buttons */}
        <div className="flex gap-8 items-center mt-8 pt-4 border-t border-gray-100">
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
