"use client";

import Button from "@/ui/form/button";
import FileDisplay from "@/ui/file-display";
import Table from "@/ui/table";
import BackButton from "@/ui/back-button";
import Heading from "@/ui/text-heading";
import SignatureComponenet from "@/ui/signature-component";
import { RetirementRequestType } from "@/types/retirement-request";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRequests } from "@/context/RequestsContext";
import { signatures } from "@/lib/config/demo-signatures";

export default function FinancialRequestModal() {
  const head = [
    "Activity Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total Budget (₦)",
    "Actual Cost (₦)",
    "Variance",
  ];

  const { retirementId } = useParams();
  const { retirements, fetchRetirements, requests } = useRequests();
  const [retirement, setRetirement] = useState<RetirementRequestType | null>(null);
  const [requestDetails, setRequestDetails] = useState<any | null>(null);
  const [outputDetails, setOutputDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRetirement = async () => {
      setIsLoading(true);
      if (!retirementId) return;

      try {
        let retirementDetails = retirements.find((r) => r.retirementId === retirementId);
        
        if (!retirementDetails) {
            const fetched = await fetchRetirements();
            retirementDetails = fetched.find((r) => r.retirementId === retirementId);
        }

        if (retirementDetails) {
            setRetirement(retirementDetails || null);
            
            let reqDetails = requests.find((r) => r.requestId === retirementDetails!.requestId);
            if (!reqDetails) {
                try {
                  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/${retirementDetails.requestId}`);
                  reqDetails = res.data.data;
                } catch (e) {
                  console.error("Failed to load associated request details", e);
                }
            }
            if (reqDetails) {
                setRequestDetails(reqDetails);
            }
        }
      } catch (error) {
        console.error("Error finding retirement specifics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRetirement();
  }, [retirementId, retirements, fetchRetirements, requests]);

  useEffect(() => {
    const fetchOutput = async () => {
      const targetOutputId = requestDetails?.outputId || retirement?.outputId;
      if (!targetOutputId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(
           `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${targetOutputId}`,
        );
        setOutputDetails(res.data.data);
      } catch (error) {
        console.error("Error fetching output details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (retirement) {
      fetchOutput();
    } else {
       setIsLoading(false);
    }
  }, [retirement, requestDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="dots my-20 mx-auto">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!retirement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Retirement not found.</p>
      </div>
    );
  }

  const totalRetirementBudget = Number(retirement.totalBudget || 0);
  const totalRetirementActualCost = Number(retirement.actualCost || 0);
  const retirementVariance = totalRetirementBudget - totalRetirementActualCost;

  const reimburseToNDSICDE = retirementVariance > 0 ? retirementVariance : 0;
  const reimburseToStaff = retirementVariance < 0 ? Math.abs(retirementVariance) : 0;

  return (
    <>
      <div className="print:hidden">
        <BackButton />
      </div>
      <div className="min-h-screen bg-gray-50 p-6 print:bg-white print:p-0">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-start print:hidden">
            <div>
              <Heading
                heading="Financial Retirement"
                subtitle={`Submitted on ${new Date(retirement.createAt).toLocaleString()}`}
              />
            </div>
            <div className="w-40 shrink-0">
              <Button
                content="Print Retirement"
                isSecondary
                onClick={() => window.print()}
              />
            </div>
          </div>

          <div className="bg-white border border-gray-300 shadow-sm p-10 print:p-0 print:border-none print:shadow-none space-y-10 text-gray-900">
            <div>
              <h3 className="text-base font-bold uppercase tracking-wider border-b border-black pb-2 mb-4">
                Submission Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Submitted by</span>
                  <span className="font-medium text-gray-900">{requestDetails?.staff || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Output</span>
                  <span className="font-medium text-gray-900">{outputDetails?.outputStatement || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Activity Title</span>
                  <span className="font-medium text-gray-900">{requestDetails?.activityTitle || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Activity Location(s)</span>
                  <span className="font-medium text-gray-900">{requestDetails?.activityLocation || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Activity Start Date</span>
                  <span className="font-medium text-gray-900">
                    {requestDetails?.activityStartDate ? new Date(requestDetails.activityStartDate).toLocaleDateString() : retirement.activityStartDate ? new Date(retirement.activityStartDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Activity End Date</span>
                  <span className="font-medium text-gray-900">
                    {requestDetails?.activityEndDate ? new Date(requestDetails.activityEndDate).toLocaleDateString() : retirement.activityEndDate ? new Date(retirement.activityEndDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-8 text-sm">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide block mb-2">Activity Purpose/Description</span>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded text-gray-800 leading-relaxed">
                  {requestDetails?.activityPurposeDescription || retirement.activityPurposeDescription || "N/A"}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold uppercase tracking-wider border-b border-black pb-2 mb-4">
                Retirement Table
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table
                  tableHead={head}
                  tableData={[retirement]}
                  renderRow={(row) => (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">{row.activityLineDescription || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">{row.quantity || "0"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">{row.frequency || "0"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">₦{(row.unitCost || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-gray-200">₦{Number(row.totalBudget || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">₦{Number(row.actualCost || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-medium border-t border-gray-200">
                        {(() => {
                          const diff = (Number(row.totalBudget) || 0) - (Number(row.actualCost) || 0);
                          if (diff < 0) {
                            return (
                              <span className="text-red-500">
                                -₦{Math.abs(diff).toLocaleString()}
                              </span>
                            );
                          } else if (diff > 0) {
                            return (
                              <span className="text-green-500">
                                +₦{diff.toLocaleString()}
                              </span>
                            );
                          } else {
                            return (
                              <span className="text-gray-500">
                                ₦0
                              </span>
                            );
                          }
                        })()}
                      </td>
                    </>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 pt-6 text-sm font-semibold text-gray-900 mt-4 text-right">
                <p>Total Activity Cost: <span className="font-bold">₦{totalRetirementActualCost.toLocaleString()}</span></p>
                <p>Amount to reimburse to NDSICDE: <span className="font-bold">₦{reimburseToNDSICDE.toLocaleString()}</span></p>
                <p>Amount to reimburse to Staff: <span className="font-bold">₦{reimburseToStaff.toLocaleString()}</span></p>
              </div>
            </div>

            <div className="flex justify-center gap-x-16 gap-y-5 items-center flex-wrap">
              {signatures.map((sign, idx) => (
                <SignatureComponenet
                  key={idx}
                  heading={sign.heading}
                  name={sign.name}
                  signature={sign.signature}
                  date={sign.date}
                />
              ))}
            </div>

            {retirement.documentURL && (
              <div className="print:hidden">
                <h3 className="text-base font-bold uppercase tracking-wider border-b border-black pb-2 mb-4">
                  Supporting Document(s)
                </h3>
                <FileDisplay
                  filename={retirement.documentName}
                  url={retirement.documentURL}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="print:hidden mt-8 pt-8 border-t border-gray-300">
              <h3 className="text-base font-bold uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="flex items-center gap-4">
                <div className="w-1/3">
                  <Button
                    content="Approve"
                  />
                </div>
                <div className="w-1/3">
                  <Button
                    content="Review"
                    isSecondary
                  />
                </div>
                <div className="w-1/3">
                  <Button
                    content="Reject"
                    isSecondary
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}