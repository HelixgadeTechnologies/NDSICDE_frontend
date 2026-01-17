"use client";

import CardComponent from "@/ui/card-wrapper";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";
import { JSX, useState } from "react";
import FormOne from "./form-one";
import FormTwo from "./form-two";
import Button from "@/ui/form/button";
import SubmitAndReview from "./submit-and-review";
import FormThree from "./form-three";
import { useParams } from "next/navigation";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import toast from "react-hot-toast";

type BudgetLine = {
  activityLineDescription: string;
  quantity: number;
  frequency: number;
  unitCost: number;
  total: number;
};

type FormData = {
  // Form One
  staff: string;
  outputId: string;
  activityTitle: string;
  activityBudgetCode: number;
  activityLocation: string;
  activityPurposeDescription: string;
  activityStartDate: string;
  activityEndDate: string;
  budgetLines: BudgetLine[];
  budgetCode: number;
  
  // Form Two
  modeOfTransport: string;
  driverName: string;
  driversPhoneNumber: string;
  vehiclePlateNumber: string;
  vehicleColor: string;
  departureTime: string;
  route: string;
  recipientPhoneNumber: string;
  
  // Form Three
  documentName: string;
  documentURL: string;
  
  // Additional fields from payload
  quantity: number;
  frequency: number;
  unitCost: number;
  total: number;
  activityLineDescription: string;
  projectId: string;
  status: string;
  requestId: string;
};

export default function FormParent() {
  const params = useParams();
  const projectId = params?.id as string || "";
  
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = getToken();
  
  const [formData, setFormData] = useState<FormData>({
    // Form One
    staff: "",
    outputId: "",
    activityTitle: "",
    activityBudgetCode: 0,
    activityLocation: "",
    activityPurposeDescription: "",
    activityStartDate: "",
    activityEndDate: "",
    budgetLines: [],
    budgetCode: 0,
    
    // Form Two
    modeOfTransport: "",
    driverName: "",
    driversPhoneNumber: "",
    vehiclePlateNumber: "",
    vehicleColor: "",
    departureTime: "",
    route: "",
    recipientPhoneNumber: "",
    
    // Form Three
    documentName: "",
    documentURL: "",
    
    // Additional fields
    quantity: 0,
    frequency: 0,
    unitCost: 0,
    total: 0,
    activityLineDescription: "",
    projectId: projectId,
    status: "pending",
    requestId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      console.log("Form data updated:", newData); // Debug log
      return newData;
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally reset form here
    // setFormData(initialState);
    // setActiveTab(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get the first budget line for the payload
      const firstBudgetLine = formData.budgetLines[0] || {
        activityLineDescription: "",
        quantity: 0,
        frequency: 0,
        unitCost: 0,
        total: 0,
      };

      // Calculate total from all budget lines
      const totalFromLines = formData.budgetLines.reduce((sum, line) => sum + line.total, 0);

      const payload = {
        isCreate: true,
        payload: {
          requestId: formData.requestId,
          staff: formData.staff,
          outputId: formData.outputId,
          activityTitle: formData.activityTitle,
          activityBudgetCode: formData.activityBudgetCode,
          activityLocation: formData.activityLocation,
          activityPurposeDescription: formData.activityPurposeDescription,
          activityStartDate: formData.activityStartDate,
          activityEndDate: formData.activityEndDate,
          activityLineDescription: firstBudgetLine.activityLineDescription || "",
          quantity: firstBudgetLine.quantity || 0,
          frequency: firstBudgetLine.frequency || 0,
          unitCost: firstBudgetLine.unitCost || 0,
          budgetCode: formData.budgetCode,
          total: totalFromLines || 0,
          modeOfTransport: formData.modeOfTransport,
          driverName: formData.driverName,
          driversPhoneNumber: formData.driversPhoneNumber,
          vehiclePlateNumber: formData.vehiclePlateNumber,
          vehicleColor: formData.vehicleColor,
          departureTime: formData.departureTime,
          route: formData.route,
          recipientPhoneNumber: formData.recipientPhoneNumber,
          documentName: formData.documentName,
          documentURL: formData.documentURL,
          projectId: formData.projectId,
          status: formData.status,
        },
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      // Validate required fields
      const requiredFields = [
        'staff', 'outputId', 'activityTitle', 'activityPurposeDescription',
        'activityStartDate', 'activityEndDate', 'modeOfTransport', 'departureTime',
        'route', 'documentName', 'documentURL'
      ];
      
      const missingFields = requiredFields.filter(field => {
        const value = payload.payload[field as keyof typeof payload.payload];
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // Use your actual API endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/request`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request submitted successfully:", response.data);
      toast.success("Request submitted successfully!");
      
      openModal();
    } catch (error: any) {
      console.error("Error submitting request:", error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Failed to submit request: ${errorMessage}`);
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    {
      id: 1,
      title: "Financial Request and Retirement",
      subtitle: "Fill out these details",
    },
    {
      id: 2,
      title: "Journey Management",
      subtitle: "Fill out these details",
    },
    {
      id: 3,
      title: "Supporting Documents",
      subtitle: "Fill out these details",
    },
    {
      id: 4,
      title: "Review & Submit",
      subtitle: "Fill out these details",
    },
  ];

  const formSteps: Record<number, JSX.Element> = {
    1: <FormOne onNext={() => setActiveTab(2)} />,
    2: (
      <FormTwo onBack={() => setActiveTab(1)} onNext={() => setActiveTab(3)} />
    ),
    3: (
      <FormThree
        onBack={() => setActiveTab(2)}
        onNext={() => setActiveTab(4)}
      />
    ),
    4: <SubmitAndReview onBack={() => setActiveTab(3)} onSubmit={handleSubmit} isSubmitting={isSubmitting} />,
  };

  return (
    <section className="flex gap-6">
      <div className="w-[65%]">
        <CardComponent height="100%">{formSteps[activeTab]}</CardComponent>
      </div>
      <div className="w-[35%]">
        <CardComponent height="100%">
          <div className="space-y-6">
            {tabs.map((tab) => {
              const isCompleted = tab.id < activeTab;
              const isCurrent = tab.id === activeTab;
              return (
                <div key={tab.id} className="flex gap-4 items-center">
                  <div
                    className={`h-12 w-12 rounded-full flex justify-center items-center ${
                      isCurrent
                        ? "bg-[#D2091E] text-white font-bold"
                        : isCompleted
                        ? "bg-[#D2091E] text-white"
                        : "bg-transparent border border-[#98A2B3] text-[#98A2B3] font-medium leading-5"
                    }`}
                  >
                    {tab.id}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[#101928] font-semibold text-base">
                      {tab.title}
                    </h4>
                    <p className="text-xs text-[#475367]">{tab.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardComponent>
      </div>

      {/* submission success modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex justify-center primary mb-4">
          <Icon icon={"simple-line-icons:check"} width={96} height={96} />
        </div>
        <h2 className="text-[28px] font-semibold mb-2 text-center text-gray-900">
          Congratulations!
        </h2>
        <p className="text-sm text-center text-gray-500">
          Request submitted successfully
        </p>
        <div className="mt-6 flex justify-center">
          <Button 
            href={`/projects/${projectId}/project-management/request`} 
            content="Close" 
            onClick={closeModal}
          />
        </div>
      </Modal>
    </section>
  );
}