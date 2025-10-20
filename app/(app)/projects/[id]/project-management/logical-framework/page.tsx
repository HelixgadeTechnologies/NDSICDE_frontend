"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import FileUploader from "@/ui/form/file-uploader";

export default function ProjectLogicalFramework() {
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const head = ["Document Name", "Upload Date", "Actions"];
  const data = [
    {
      userId: 1,
      documentName: "Logical Framework 1",
      uploadDate: "May 15, 2025 10:30",
    },
    {
      userId: 2,
      documentName: "Logical Framework 2",
      uploadDate: "May 20, 2025 10:30",
    },
  ];
  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button
          content="Upload Framework"
          icon="si:add-fill"
          onClick={() => setIsOpen(true)}
        />
      </div>

      <CardComponent>
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"userId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.documentName}</td>
              <td className="px-6">{row.uploadDate}</td>
              <td className="px-6 relative">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) =>
                      prev === row.userId ? null : row.userId
                    )
                  }
                />

                {activeRowId === row.userId && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-[6px] border border-[#E5E5E5] shadow-md w-[200px]"
                    >
                      <ul className="text-sm">
                        <li className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"hugeicons:view"}
                            height={20}
                            width={20}
                          />
                          View Framework
                        </li>
                        <li className="cursor-pointer hover:text-[var(--primary-light)] flex gap-2 p-3 items-center">
                          <Icon
                            icon={"pixelarticons:trash"}
                            height={20}
                            width={20}
                          />
                          Remove
                        </li>
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                )}
              </td>
            </>
          )}
        />
      </CardComponent>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="600px">
        <div className="space-y-8">
          <Heading
            heading="Upload Logical Framework Document"
            className="text-center"
          />
          <FileUploader />
          <div className="flex items-center gap-4">
            <Button
              content="Cancel"
              onClick={() => setIsOpen(false)}
              isSecondary
            />
            <Button content="Next" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
