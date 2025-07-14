'use client';

import { motion, AnimatePresence } from "framer-motion";
import Button from "@/ui/button";
import { Icon } from "@iconify/react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  header: string;
  message: string;
  buttonContent: string;
  icon?: string;
};

export default function Modal({ 
    isOpen, 
    onClose, 
    header,
    message,
    buttonContent = "Okay",
    icon,
    onClick,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 z-50 relative text-black"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
            >
              <div className="flex justify-center text-[var(--primary)] mb-4">
                {icon && <Icon icon={icon} width={96} height={96} />}
              </div>
              <h2 className="text-[28px] font-semibold mb-2 text-center text-gray-900">
                {header}
              </h2>
              <p className="text-sm text-center text-gray-500">{message}</p>
              <div className="mt-6 flex justify-end gap-2">
                <Button onClick={onClick} content={buttonContent} />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}