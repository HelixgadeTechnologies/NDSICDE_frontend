"use client";

import Button from "@/ui/form/button";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";

type DeleteProps = {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
  subtitle?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
};

// inlcude function prop to delete
export default function DeleteModal({
  isOpen,
  onClose,
  heading,
  subtitle,
  onDelete,
  isDeleting,
}: DeleteProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="400px">
        <div className="flex justify-center primary mb-4">
          <Icon icon={"si:warning-line"} width={96} height={96} />
        </div>
        <Heading
          heading={heading}
          subtitle={subtitle}
          className="text-center"
        />

        <div className="mt-4 flex justify-center mx-auto gap-2 w-45">
          <Button content="No" onClick={onClose} isSecondary />
          <Button content="Yes" isLoading={isDeleting} onClick={onDelete} />
        </div>
      </Modal>
    </>
  );
}
