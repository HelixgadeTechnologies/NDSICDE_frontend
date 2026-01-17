// context/form-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FormData = {
  requestId: string;
  staff: string;
  outputId: string;
  activityTitle: string;
  activityBudgetCode: number;
  activityLocation: string;
  activityPurposeDescription: string;
  activityStartDate: string;
  activityEndDate: string;
  activityLineDescription: string;
  quantity: number;
  frequency: number;
  unitCost: number;
  budgetCode: number;
  total: number;
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
  projectId: string;
  status: string;
  // For budget lines (array of items)
  budgetLines: Array<{
    activityLineDescription: string;
    quantity: number;
    frequency: number;
    unitCost: number;
    total: number;
  }>;
};

type FormContextType = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialFormData: FormData = {
  requestId: "",
  staff: "",
  outputId: "",
  activityTitle: "",
  activityBudgetCode: 0,
  activityLocation: "",
  activityPurposeDescription: "",
  activityStartDate: "",
  activityEndDate: "",
  activityLineDescription: "",
  quantity: 0,
  frequency: 0,
  unitCost: 0,
  budgetCode: 0,
  total: 0,
  modeOfTransport: "",
  driverName: "",
  driversPhoneNumber: "",
  vehiclePlateNumber: "",
  vehicleColor: "",
  departureTime: "",
  route: "",
  recipientPhoneNumber: "",
  documentName: "",
  documentURL: "",
  projectId: "",
  status: "Active",
  budgetLines: [],
};

export function RequestProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeStep, setActiveStep] = useState(1);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setActiveStep(1);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm, activeStep, setActiveStep }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a RequestProvider");
  }
  return context;
}