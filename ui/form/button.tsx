"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

type ButtonProps = {
  content: string;
  href?: string;
  onClick?: () => void;
  isSecondary?: boolean;
  icon?: string;
  isDisabled?: boolean;
};

export default function Button({ 
    content, 
    href, 
    onClick, 
    isSecondary,
    icon,
    isDisabled,
}: ButtonProps) {
  const classes = `${isDisabled ? "cursor-not-allowed bg-red-400 bg-red-400 text-white" : isSecondary ? 'cursor-pointer bg-white text-[#D2091E] border border-[#D2091E] hover:bg-gray-100' : 'cursor-pointer bg-[#D2091E] text-white hover:bg-[#C2071A] '} rounded-[8px] h-[50px] w-full px-5 md:px-6 leading-6 font-medium text-sm md:text-base block transition-colors duration-300 ${icon && 'gap-2 flex items-center justify-center'}`;

  if (href) {
    return (
      <Link href={href}>
        {icon && (<Icon icon={icon} width={20} height={20} />)}
        <button className={classes}>{content}</button>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon && (<Icon icon={icon} width={20} height={20} />)}
      {content}
    </button>
  );
}