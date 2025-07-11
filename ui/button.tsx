"use client";

import Link from "next/link";

type ButtonProps = {
  content: string;
  href?: string;
  onClick?: () => void;
  isSecondary?: boolean;
};

export default function Button({ 
    content, 
    href, 
    onClick, 
    isSecondary,
}: ButtonProps) {
  const classes = `${isSecondary ? 'bg-white text-[#D2091E] border border-[#D2091E] hover:bg-gray-100' : 'bg-[#D2091E] text-white hover:bg-[#C2071A] '} rounded-[8px] h-[50px] w-full px-5 md:px-6 leading-6 font-medium hover:cursor-pointer text-sm md:text-base block transition-colors duration-300`;

  if (href) {
    return (
      <Link href={href}>
        <button className={classes}>{content}</button>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}