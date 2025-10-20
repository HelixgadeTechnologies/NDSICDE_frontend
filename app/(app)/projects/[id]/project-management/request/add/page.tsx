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

export default function FormParent() {
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    4: <SubmitAndReview onBack={() => setActiveTab(3)} onSubmit={openModal} />,
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
          Project successfully created
        </p>
        <div className="mt-6">
          <Button href="/project-management/request" content="Close" />
        </div>
      </Modal>
    </section>
  );
}
