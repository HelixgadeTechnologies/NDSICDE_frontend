"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export type ActionMenuItem =
  | {
      type: "button";
      label: string;
      icon: string;
      onClick: () => void;
      className?: string;
    }
  | {
      type: "link";
      label: string;
      icon: string;
      href: string;
      className?: string;
    };

type ActionMenuProps = {
  isOpen: boolean;
  items: ActionMenuItem[];
};

/* Animated dropdown menu used in table action cells. Pair with a state variable per row and toggle on the "more" icon click. */
export default function ActionMenu({ isOpen, items }: ActionMenuProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50"
      >
        <ul className="text-sm">
          {items.map((item, i) => {
            const sharedClass = `cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center ${item.className ?? ""}`;
            if (item.type === "link") {
              return (
                <Link key={i} href={item.href} className={sharedClass}>
                  <Icon icon={item.icon} height={20} width={20} />
                  {item.label}
                </Link>
              );
            }
            return (
              <li key={i} onClick={item.onClick} className={sharedClass}>
                <Icon icon={item.icon} height={20} width={20} />
                {item.label}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
