"use client";

import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import {
  RetirementRequestHead,
  RetirementRequestData,
} from "@/types/retirement-request";
import { useRetirementRequestModal } from "@/utils/retirement-request-utility";
import FinancialRequestAndRetirementModal from "./financial-request-retirement-modal";

export default function RetirementRequest() {
  const { viewRequest, handleViewRequest, setViewRequest, selectedRequest } =
    useRetirementRequestModal();

  return (
    <>
      <Table
        tableHead={RetirementRequestHead}
        tableData={RetirementRequestData}
        idKey={"id"}
        checkbox
        renderRow={(row) => (
          <>
            <td className="px-6">{row.activityLineDesc}</td>
            <td className="px-6">{row.quantity}</td>
            <td className="px-6">{row.frequency}</td>
            <td className="px-6">{row.unitCost}</td>
            <td className="px-6">{row.totalBudget}</td>
            <td className="px-6">{row.actualCost}</td>
            <td
              className={`px-6 ${
                row.status === "Approved"
                  ? "text-green-500"
                  : row.status === "Pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {row.status}
            </td>
              <td className="px-6">
                <Icon
                  onClick={() => 
                    handleViewRequest(row)
                  }
                  icon={"hugeicons:view"}
                  height={20}
                  width={20}
                  className="cursor-pointer"
                />
              </td>
          </>
        )}
      />

      {viewRequest && selectedRequest && (
        <FinancialRequestAndRetirementModal
        isOpen={viewRequest}
        onClose={() => setViewRequest(false)}
        request={selectedRequest}
        />
      )}
    </>
  );
}
