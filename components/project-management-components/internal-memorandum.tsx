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
      <div className="flex justify-between items-start mb-6 text-black border-b-2 border-black pb-4">
        <div className="flex-1 text-center pt-2 pl-12">
          <h1 className="text-sm font-bold tracking-wide leading-tight">
            NIGER DELTA STAKEHOLDERS INITIATIVE FOR COMMUNITY DEVELOPMENT <br />
            AND EMPOWERMENT (NDSICDE)
          </h1>
          <h2 className="text-xs font-semibold tracking-wide mt-1">
            PORT HACOURT, RIVER STATE
          </h2>
          <h3 className="text-base font-extrabold mt-3 uppercase tracking-widest text-[#D2091E]">
            INTERNAL MEMORANDUM
          </h3>
        </div>
        <div className="text-right text-[10px] text-gray-700 leading-normal font-medium max-w-[200px] select-none">
          <p className="font-bold text-black text-[11px] mb-0.5">NDSICDE</p>
          <p>Nigerian Secretariat,</p>
          <p>13A location Road,</p>
          <p>Oroazi, Port Harcourt</p>
        </div>
      </div>

      {/* Memorandum Grid Table */}
      <div className="border border-black text-xs text-black mb-8 select-none">
        {/* Row 1 */}
        <div className="flex border-b border-black">
          <div className="w-1/2 p-2.5 border-r border-black flex items-center gap-2 bg-gray-50/55">
            <span className="font-bold uppercase tracking-wider text-[10px] w-24">FROM:</span>
            <span className="text-black font-semibold text-xs">{staff || "N/A"}</span>
          </div>
          <div className="w-1/2 p-2.5 flex items-center gap-2 bg-gray-50/55">
            <span className="font-bold uppercase tracking-wider text-[10px] w-24">DATE:</span>
            <span className="text-black font-bold text-xs">{requestDate || "N/A"}</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex border-b border-black">
          <div className="w-1/2 p-2.5 border-r border-black flex items-center gap-2 bg-gray-50/55">
            <span className="font-bold uppercase tracking-wider text-[10px] w-24">TO:</span>
            <span className="text-black font-semibold text-xs">Country Director/ Budget Holder</span>
          </div>
          <div className="w-1/2 p-2.5 flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] w-24">BUDGET NAME:</span>
            {isReadOnly ? (
              <span className="text-black font-bold text-xs">{budgetName || "N/A"}</span>
            ) : (
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-black font-bold text-xs placeholder:text-gray-400 placeholder:font-normal"
                value={budgetName || ""}
                placeholder="Enter budget name..."
                onChange={(e) => setBudgetName && setBudgetName(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex">
          <div className="w-1/2 p-2.5 border-r border-black flex items-center gap-2 bg-gray-50/55">
            <span className="font-bold uppercase tracking-wider text-[10px] w-24">Thru:</span>
            <span className="text-black font-semibold text-xs">Finance Manager</span>
          </div>
          <div className="w-1/2 p-2.5 flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] w-24">BUDGET CODE:</span>
            {isReadOnly ? (
              <span className="text-black font-bold text-xs">{budgetCode || "N/A"}</span>
            ) : (
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-black font-bold text-xs placeholder:text-gray-400 placeholder:font-normal"
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
