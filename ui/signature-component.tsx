"use client";

import Image from "next/image";

type SignatureProps = {
  heading?: string;
  name: string;
  signature: string;
  date?: string;
};

export default function SignatureComponenet({
  heading,
  name,
  signature,
  date,
}: SignatureProps) {
  return (
    <div className="mt-4">
      {/* heading */}
      {heading && <h4 className="text-sm font-bold text-center">{heading}</h4>}

      {/* signature */}
      <div className="flex items-center gap-2 text-xs">
        <p className="font-semibold">Signature:</p>
        <div className="space-y-1">
            <div className="w-40 border-b border-gray-700 relative h-12 pb-1">
            {signature && (
                <Image
                src={signature}
                alt="Signature"
                fill
                className="object-contain object-bottom"
                />
            )}
            </div>
            <p className="text-xs font-semibold text-center">{name}</p>
            <p className="text-xs font-semibold text-center">{date}</p>
        </div>
      </div>
    </div>
  );
}
