"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";
import { useState } from "react";
import FormOne from "./form-one";
import FormTwo from "./form-two";
import Button from "@/ui/form/button";

export default function FormParent() {
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const tabs = [
    {
      id: 1,
      title: "Create New Project",
      subtitle: "Fill out these details and get your trust ready",
    },
    {
      id: 2,
      title: "Project Location",
      subtitle: "Get full control over your audience",
    },
  ];

  return (
    <section className="flex gap-6">
      <div className="w-3/5">
        <CardComponent height="100%">
          <Heading
            heading="Create New Project"
            subtitle="Fill out these details to build your broadcast"
            className="text-center"
          />
          {activeTab === 1 ? (
            <FormOne onClick={() => setActiveTab(2)} />
          ) : (
            <FormTwo 
              onClick={() => setActiveTab(1)} 
              onNext={openModal}
            />
          )}
        </CardComponent>
      </div>
      <div className="w-2/5">
        <CardComponent height="100%">
          <div className="space-y-6">
            {tabs.map((tab) => {
              // Show both tabs as active when on form two (activeTab === 2)
              const isActive = activeTab === tab.id || (activeTab === 2 && tab.id <= 2);
              return (
                <div key={tab.id} className="flex gap-4 items-center">
                  <div
                    className={`h-12 w-12 rounded-full flex justify-center items-center ${
                      isActive
                        ? "bg-[#D2091E] text-white font-bold leading-5"
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
          <Button
            href="/admin/dashboard"
            content="Close"
          />
        </div>
      </Modal>
    </section>
  );
}