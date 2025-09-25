"use client";

import Button from "@/ui/form/button";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";

type DeleteProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DeleteProjectPartnerModal({
  isOpen,
  onClose,
}: DeleteProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="400px">
        <div className="flex justify-center primary mb-4">
          <Icon icon={"si:warning-line"} width={96} height={96} />
        </div>
        <Heading
          heading="Do you want to remove this  Project Partner?"
          className="text-center"
        />

        <div className="mt-4 flex justify-center mx-auto gap-2 w-[180px]">
          <Button content="Yes" isSecondary />
          <Button content="No" onClick={onClose} />
        </div>
      </Modal>
    </>
  );
}
