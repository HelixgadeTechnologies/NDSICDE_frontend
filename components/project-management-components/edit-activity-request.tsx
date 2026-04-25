"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import FileUploader from "@/ui/form/file-uploader";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";
import { useState, useEffect } from "react";
import DateInput from "@/ui/form/date-input";
import RadioInput from "@/ui/form/radio";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "@/lib/api/credentials";
import { ProjectRequestType } from "@/types/project-management-types";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProjectRequestType;
  projectId: string;
};

// Define formData structure similar to the create page
export type RequestFormData = {
  staff: string;
  outputId: string;
  activityTitle: string;
  activityBudgetCode: string;
  activityLocation: string;
  activityPurposeDescription: string;
  activityStartDate: string;
  activityEndDate: string;
  activityLineDescription: string;
  quantity: string;
  frequency: string;
  unitCost: string;
  budgetCode: string; // fallback if needed
  total: string;
  modeOfTransport: string;
  driverName: string;
  driversPhoneNumber: string;
  vehiclePlateNumber: string;
  vehicleColor: string;
  departureTime: string;
  route: string;
  recipientPhoneNumber: string;
  documentName: string;
  documentURL: string;
};

export default function EditActivityRequest({ isOpen, onClose, initialData, projectId }: EditProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [outputsOptions, setOutputsOptions] = useState<{ label: string; value: string }[]>([]);
  const token = getToken();

  const [formData, setFormData] = useState<RequestFormData>({
    staff: "",
    outputId: "",
    activityTitle: "",
    activityBudgetCode: "",
    activityLocation: "",
    activityPurposeDescription: "",
    activityStartDate: "",
    activityEndDate: "",
    activityLineDescription: "",
    quantity: "",
    frequency: "",
    unitCost: "",
    budgetCode: "",
    total: "",
    modeOfTransport: "Road",
    driverName: "",
    driversPhoneNumber: "",
    vehiclePlateNumber: "",
    vehicleColor: "",
    departureTime: "",
    route: "",
    recipientPhoneNumber: "",
    documentName: "",
    documentURL: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        staff: initialData.staff || "",
        outputId: initialData.outputId || "",
        activityTitle: initialData.activityTitle || "",
        activityBudgetCode: initialData.activityBudgetCode?.toString() || "",
        activityLocation: initialData.activityLocation || "",
        activityPurposeDescription: initialData.activityPurposeDescription || "",
        activityStartDate: initialData.activityStartDate || "",
        activityEndDate: initialData.activityEndDate || "",
        activityLineDescription: initialData.activityLineDescription || "",
        quantity: initialData.quantity?.toString() || "",
        frequency: initialData.frequency?.toString() || "",
        unitCost: initialData.unitCost?.toString() || "",
        budgetCode: initialData.budgetCode?.toString() || "",
        total: initialData.total?.toString() || "",
        modeOfTransport: initialData.modeOfTransport || "Road",
        driverName: initialData.driverName || "",
        driversPhoneNumber: initialData.driversPhoneNumber || "",
        vehiclePlateNumber: initialData.vehiclePlateNumber || "",
        vehicleColor: initialData.vehicleColor || "",
        departureTime: initialData.departureTime || "",
        route: initialData.route || "",
        recipientPhoneNumber: initialData.recipientPhoneNumber || "",
        documentName: initialData.documentName || "",
        documentURL: initialData.documentURL || "",
      });
      setActiveStep(1);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const fetchOutputs = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outputs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const data = res.data?.data || [];
        const options = data.map((item: any) => ({
          label: item.outputStatement,
          value: item.outputId,
        }));
        setOutputsOptions(options);
      } catch (error) {
        console.error("Error fetching outputs:", error);
      }
    };
    if (isOpen) {
      fetchOutputs();
    }
  }, [isOpen, token]);

  const updateFormData = (data: Partial<RequestFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!formData.staff || !formData.activityTitle || !formData.activityPurposeDescription || !formData.activityStartDate || !formData.activityEndDate || !formData.activityLineDescription) {
        toast.error("Please fill in all required fields on this step.");
        return;
      }
    }
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.documentName || !formData.documentURL) {
       toast.error("Please provide a supportive document name and upload a file.");
       return;
    }
    setLoading(true);
    try {
      const payload = {
        isCreate: false,
        data: {
          requestId: initialData?.requestId,
          staff: formData.staff,
          outputId: formData.outputId,
          activityTitle: formData.activityTitle,
          activityBudgetCode: Number(formData.activityBudgetCode) || 0,
          activityLocation: formData.activityLocation,
          activityPurposeDescription: formData.activityPurposeDescription,
          activityStartDate: formData.activityStartDate ? new Date(formData.activityStartDate).toISOString() : new Date().toISOString(),
          activityEndDate: formData.activityEndDate ? new Date(formData.activityEndDate).toISOString() : new Date().toISOString(),
          activityLineDescription: formData.activityLineDescription,
          quantity: Number(formData.quantity) || 0,
          frequency: Number(formData.frequency) || 0,
          unitCost: Number(formData.unitCost) || 0,
          budgetCode: Number(formData.budgetCode) || 0,
          total: Number(formData.total) || 0,
          modeOfTransport: formData.modeOfTransport,
          driverName: formData.driverName,
          driversPhoneNumber: formData.driversPhoneNumber,
          vehiclePlateNumber: formData.vehiclePlateNumber,
          vehicleColor: formData.vehicleColor,
          departureTime: formData.departureTime ? new Date(formData.departureTime).toISOString() : new Date().toISOString(),
          route: formData.route,
          recipientPhoneNumber: formData.recipientPhoneNumber,
          documentName: formData.documentName,
          documentURL: formData.documentURL || "string",
          projectId: projectId,
          status: initialData?.status || "Pending"
        }
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadComplete = (uploadedUrl: string) => {
    updateFormData({ documentURL: uploadedUrl });
  };

  const handleUploadError = (error: string) => {
    toast.error(error || "Failed to upload document.");
  };

  const totalCalc = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.frequency) || 0) * (parseFloat(formData.unitCost) || 0);

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Heading heading="Financial Request and Retirement" />
             <TextInput 
              label="Staff" 
              name="staff" 
              value={formData.staff} 
              onChange={(e) => updateFormData({ staff: e.target.value })} 
            />
            <DropDown
              label="Output"
              name="outputId"
              value={formData.outputId}
              onChange={(value) => updateFormData({ outputId: value })}
              options={outputsOptions}
            />
            <TextInput
              label="Activity Title"
              name="activityTitle"
              value={formData.activityTitle}
              onChange={(e) => updateFormData({ activityTitle: e.target.value })}
            />
            <TextInput
              label="Activity Budget Code"
              name="activityBudgetCode"
              value={formData.activityBudgetCode}
              onChange={(e) => updateFormData({ activityBudgetCode: e.target.value })}
            />
            <TextInput
              label="Activity Location(s)"
              name="activityLocation"
              value={formData.activityLocation}
              onChange={(e) => updateFormData({ activityLocation: e.target.value })}
            />
            <TextareaInput
              label="Activity Purpose/Description"
              name="activityPurposeDescription"
              value={formData.activityPurposeDescription}
              onChange={(e) => updateFormData({ activityPurposeDescription: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <DateInput 
                label="Activity Start Date" 
                value={formData.activityStartDate} 
                onChange={(date) => updateFormData({ activityStartDate: date })} 
              />
              <DateInput 
                label="Activity End Date" 
                value={formData.activityEndDate} 
                onChange={(date) => updateFormData({ activityEndDate: date })} 
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm primary">Add Budget Line Item</p>
              <TextareaInput
                label="Activity Line Description"
                name="activityLineDescription"
                value={formData.activityLineDescription}
                onChange={(e) => updateFormData({ activityLineDescription: e.target.value })}
              />
            </div>
            <TextInput
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={(e) => updateFormData({ quantity: e.target.value, total: ((parseFloat(e.target.value) || 0) * (parseFloat(formData.frequency) || 0) * (parseFloat(formData.unitCost) || 0)).toString() })}
            />
            <TextInput
              label="Frequency"
              name="frequency"
              value={formData.frequency}
              onChange={(e) => updateFormData({ frequency: e.target.value, total: ((parseFloat(formData.quantity) || 0) * (parseFloat(e.target.value) || 0) * (parseFloat(formData.unitCost) || 0)).toString() })}
            />
            <TextInput
              label="Unit Cost (₦)"
              name="unitCost"
              value={formData.unitCost}
              onChange={(e) => updateFormData({ unitCost: e.target.value, total: ((parseFloat(formData.quantity) || 0) * (parseFloat(formData.frequency) || 0) * (parseFloat(e.target.value) || 0)).toString() })}
            />
            <TextInput
              label="Budget Code"
              name="budgetCode"
              value={formData.budgetCode}
              onChange={(e) => updateFormData({ budgetCode: e.target.value })}
            />
            <TextInput
              label="Total (₦) - Qty*Frq*Unit cost"
              name="total"
              value={totalCalc.toFixed(2)}
              onChange={() => {}}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <Heading heading="Journey Management" />
            <div className="space-y-1">
              <p className="text-sm text-gray-900 font-medium">Mode of Transport</p>
              <div className="flex items-center gap-6">
                <RadioInput
                  label="Road"
                  value="Road"
                  name="modeOfTransport"
                  onChange={() => updateFormData({ modeOfTransport: "Road" })}
                  is_checked={formData.modeOfTransport === "Road"}
                />
                <RadioInput
                  label="Flight"
                  value="Flight"
                  name="modeOfTransport"
                  onChange={() => updateFormData({ modeOfTransport: "Flight" })}
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
              onChange={(date) => updateFormData({ departureTime: date })} 
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
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <Heading heading="Support Document" />
            <TextInput
              label="Document Name"
              name="documentName"
              value={formData.documentName}
              onChange={(e) => updateFormData({ documentName: e.target.value })}
            />
            <FileUploader 
               multiple={false}
               token={token || undefined}
               onUploadComplete={handleFileUploadComplete}
               onUploadError={handleUploadError}
               autoUpload={true}
            />
            {formData.documentURL && <p className="text-sm text-green-600">Current active file is uploaded.</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <div className="space-y-6">
        {/* Form Content */}
        <div className="h-[500px] custom-scrollbar overflow-y-auto pr-2">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 gap-6">
          <Button
            content={activeStep > 1 ? "Back" : "Cancel"}
            isSecondary
            onClick={activeStep > 1 ? handlePrevious : onClose}
            isDisabled={loading}
          />
          <Button 
            content={activeStep < 3 ? "Next" : (loading ? "Updating..." : "Update Request")} 
            onClick={handleNext} 
            isDisabled={loading}
          />
        </div>
      </div>
    </Modal>
  );
}
