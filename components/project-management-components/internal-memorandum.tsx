import React from "react";

interface InternalMemorandumProps {
  isReadOnly?: boolean;
  staff: string;
  requestDate: string;
  budgetName: string;
  setBudgetName?: (val: string) => void;
  budgetCode: string;
  setBudgetCode?: (val: string) => void;
}

export default function InternalMemorandum({
  isReadOnly = false,
  staff,
  requestDate,
  budgetName,
  setBudgetName,
  budgetCode,
  setBudgetCode,
}: InternalMemorandumProps) {
  const handleBudgetCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers, periods, and hyphens
    const filtered = value.replace(/[^0-9.-]/g, "");
    if (setBudgetCode) {
      setBudgetCode(filtered);
    }
  };

  return (
    <div className="w-full">
      {/* NDSICDE Memorandum Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4 md:gap-0 mb-6 text-black border-b-2 border-black pb-4">
        <div className="flex-1 text-center md:pt-2 md:pl-12 order-2 md:order-1">
          <h1 className="text-xs sm:text-sm font-bold tracking-wide leading-tight">
            NIGER DELTA STAKEHOLDERS INITIATIVE FOR COMMUNITY DEVELOPMENT <br className="hidden sm:block" />
            AND EMPOWERMENT (NDSICDE)
          </h1>
          <h2 className="text-[10px] sm:text-xs font-semibold tracking-wide mt-1">
            PORT HACOURT, RIVER STATE
          </h2>
          <h3 className="text-sm sm:text-base font-extrabold mt-3 uppercase tracking-widest text-[#D2091E]">
            INTERNAL MEMORANDUM
          </h3>
        </div>
        <div className="text-center md:text-right text-[10px] text-gray-700 leading-normal font-medium md:max-w-50 select-none order-1 md:order-2">
          <p className="font-bold text-black text-[11px] mb-0.5">NDSICDE</p>
          <p>Nigerian Secretariat,</p>
          <p>13A location Road,</p>
          <p>Oroazi, Port Harcourt</p>
        </div>
      </div>

      {/* Memorandum Grid Table */}
      <div className="border border-black text-xs text-black mb-8 select-none">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row border-b border-black">
          <div className="w-full sm:w-1/2 p-2.5 border-b sm:border-b-0 sm:border-r border-black flex items-center gap-2 bg-gray-50/55">
            <span className="font-bold uppercase tracking-wider text-[10px] w-16 sm:w-24 shrink-0">FROM:</span>
            <span className="text-black font-semibold text-xs">{staff || "N/A"}</span>
          </div>
          <div className="w-full sm:w-1/2 p-2.5 flex items-center gap-2 bg-gray-50/55">
            <span className="font-bold uppercase tracking-wider text-[10px] w-16 sm:w-24 shrink-0">DATE:</span>
            <span className="text-black font-bold text-xs">{requestDate || "N/A"}</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row border-b border-black">
          <div className="w-full sm:w-1/2 p-2.5 border-b sm:border-b-0 sm:border-r border-black flex items-center gap-2 bg-gray-50/55">
            <span className="font-bold uppercase tracking-wider text-[10px] w-16 sm:w-24 shrink-0">TO:</span>
            <span className="text-black font-semibold text-xs">Country Director/ Budget Holder</span>
          </div>
          <div className="w-full sm:w-1/2 p-2.5 flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] w-20 sm:w-24 shrink-0">BUDGET NAME:</span>
            {isReadOnly ? (
              <span className="text-black font-bold text-xs">{budgetName || "N/A"}</span>
            ) : (
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-0 p-0 text-black font-bold text-xs placeholder:text-gray-400 placeholder:font-normal"
                value={budgetName || ""}
                placeholder="Enter budget name..."
                onChange={(e) => setBudgetName && setBudgetName(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/2 p-2.5 border-b sm:border-b-0 sm:border-r border-black flex items-center gap-2 bg-gray-50/55">
            <span className="font-bold uppercase tracking-wider text-[10px] w-16 sm:w-24 shrink-0">Thru:</span>
            <span className="text-black font-semibold text-xs">Finance Manager</span>
          </div>
          <div className="w-full sm:w-1/2 p-2.5 flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] w-20 sm:w-24 shrink-0">BUDGET CODE:</span>
            {isReadOnly ? (
              <span className="text-black font-bold text-xs">{budgetCode || "N/A"}</span>
            ) : (
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-0 p-0 text-black font-bold text-xs placeholder:text-gray-400 placeholder:font-normal"
                value={budgetCode || ""}
                placeholder="Enter budget code (e.g. 610.4.1)"
                onChange={handleBudgetCodeChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
