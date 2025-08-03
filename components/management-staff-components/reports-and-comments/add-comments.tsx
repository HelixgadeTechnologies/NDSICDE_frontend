"use client";

import CardComponent from "@/ui/card-wrapper";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";
import Button from "@/ui/form/button";
import { Icon } from "@iconify/react";

type AddCommentsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddComment({ isOpen, onClose }: AddCommentsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px">
      <div className="flex justify-end mb-6 cursor-pointer">
        <Icon onClick={onClose} icon={"ic:round-close"} height={20} width={20} />
      </div>
      <CardComponent>
        <Heading heading="Add Comments" />
        <div className="mt-2.5">
          <TextareaInput
            value=""
            name=""
            placeholder="Type your comment here"
            onChange={() => {}}
          />
        </div>
      </CardComponent>
      <div className="mt-6">
        <Button content="Submit" />
      </div>
    </Modal>
  );
}
