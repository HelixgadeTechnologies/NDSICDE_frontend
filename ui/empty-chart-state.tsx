"use client";

import React from "react";

type EmptyChartStateProps = {
  title?: string;
  subtitle?: string;
  height?: string | number;
};

export default function EmptyChartState({
  title = "No data to display",
  subtitle = "There is currently no information available for this chart.",
  height = 300,
}: EmptyChartStateProps) {
  return (
    <div
      style={{ height }}
      className="flex flex-col items-center justify-center w-full text-gray-400 space-y-2 border-2 border-dashed border-gray-100 rounded-xl my-4 bg-gray-50/30"
    >
      <p className="text-base font-semibold text-gray-600">{title}</p>
      <p className="text-xs text-gray-400 max-w-[250px] text-center">
        {subtitle}
      </p>
    </div>
  );
}
