"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Table from "@/ui/table";
import Button from "@/ui/form/button";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import FileDisplay from "@/ui/file-display";
import InternalMemorandum from "@/components/project-management-components/internal-memorandum";
import SignatureComponenet from "@/ui/signature-component";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import { getToken } from "@/lib/api/credentials";
import { useRoleStore } from "@/store/role-store";
import { toast } from "react-toastify";
import {
  ProjectRequestResponseType,
  RequestLineItemType,
} from "@/types/project-management-types";
import { RetirementRequestType } from "@/types/retirement-request";
import { signatures } from "@/lib/config/demo-signatures";

export default function ApproveRequestViewPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const token = getToken();
  const { user } = useRoleStore();

  const type = searchParams.get("type") || "request";
  const requestId = searchParams.get("requestId");
  const retirementId = searchParams.get("retirementId");
  const projectId = (params?.id as string) || "";

  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [requestDetails, setRequestDetails] =
    useState<ProjectRequestResponseType | null>(null);
  const [outputDetails, setOutputDetails] = useState<any>(null);

  const [retirementDetails, setRetirementDetails] =
    useState<RetirementRequestType | null>(null);
  const [retirementRequest, setRetirementRequest] =
    useState<ProjectRequestResponseType | null>(null);
  const [retirementOutput, setRetirementOutput] = useState<any>(null);

  const lineItemHead = [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total (₦)",
  ];
  const retirementHead = [
    "Activity Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total Budget (₦)",
    "Actual Cost (₦)",
    "Variance (₦)",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (type === "request" && requestId) {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/${requestId}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          const data = res.data.data;
          setRequestDetails(data);
          if (data.outputId) {
            const outputRes = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${data.outputId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            setOutputDetails(outputRes.data.data);
          }
        } else if (type === "retirement" && retirementId) {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/retirement/retirement/project/${projectId}`,
          );
          const found = (res.data?.data || []).find(
            (r: RetirementRequestType) => r.retirementId === retirementId,
          );
          if (found) {
            setRetirementDetails(found);
            const reqRes = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/${found.requestId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            const reqData = reqRes.data.data;
            setRetirementRequest(reqData);
            if (reqData.outputId) {
              const outputRes = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${reqData.outputId}`,
                { headers: { Authorization: `Bearer ${token}` } },
              );
              setRetirementOutput(outputRes.data.data);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [type, requestId, retirementId, projectId, token]);

  const handleAction = async (approvalStatus: 2 | 3) => {
    if (!comment.trim()) {
      toast.error("Please add a comment before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      const endpoint =
        type === "request"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/approve`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/api/retirement/retirement/approve`;

      const payload =
        type === "request"
          ? { requestId, approvalStatus, approvedBy: user?.id, comment }
          : { retirementId, approvalStatus, approvedBy: user?.id, comment };

      await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        approvalStatus === 2 ? "Request rejected." : "Marked for review.",
      );
      router.back();
    } catch {
      toast.error("Failed to process action. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (type === "request" && !requestDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Request not found.</p>
      </div>
    );
  }

  if (type === "retirement" && !retirementDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Retirement not found.</p>
      </div>
    );
  }

  if (type === "request" && requestDetails) {

    return (
      <div className="mt-8 space-y-6 pb-12">
        <div className="flex justify-between items-center print:hidden">
          <Heading
            heading="Financial Request Details"
            subtitle={`${requestDetails.activityTitle || "N/A"} — Submitted on ${formatDate(requestDetails.activityStartDate)}`}
          />
          <div className="w-40 shrink-0">
            <Button
              content="Print Request"
              isSecondary
              onClick={() => window.print()}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-white border border-gray-300 shadow-sm p-10 print:p-0 print:border-none print:shadow-none space-y-10 text-gray-900">
          <InternalMemorandum
            isReadOnly
            staff={requestDetails.staff}
            requestDate={
              requestDetails.requestDate ||
              formatDate(requestDetails.activityStartDate, "date-only")
            }
            budgetName={requestDetails.project?.projectName || "N/A"}
            budgetCode={requestDetails.activityBudgetCode?.toString() || "N/A"}
          />

          <div>
            <h3 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
              Activity Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                  Output
                </span>
                <span className="font-medium text-gray-900">
                  {outputDetails?.outputStatement || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                  Activity Title
                </span>
                <span className="font-medium text-gray-900">
                  {requestDetails.activityTitle || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                  Activity Location(s)
                </span>
                <span className="font-medium text-gray-900">
                  {requestDetails.activityLocation || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                  Activity Start Date
                </span>
                <span className="font-medium text-gray-900">
                  {requestDetails.activityStartDate
                    ? formatDate(requestDetails.activityStartDate, "date-only")
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                  Activity End Date
                </span>
                <span className="font-medium text-gray-900">
                  {requestDetails.activityEndDate
                    ? formatDate(requestDetails.activityEndDate, "date-only")
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-8 text-sm">
              <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide block mb-2">
                Activity Purpose/Description
              </span>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded text-gray-800 leading-relaxed">
                {requestDetails.activityPurposeDescription || "N/A"}
              </div>
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

          <div>
            <h3 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
              Budget Breakdown
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table
                tableHead={lineItemHead}
                tableData={requestDetails.lineItems || []}
                renderRow={(row: RequestLineItemType) => (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      <p className="w-40 truncate">{row.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      {row.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      {row.frequency}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      ₦{row.unitCost?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-gray-200">
                      ₦{row.totalBudget?.toLocaleString() || 0}
                    </td>
                  </>
                )}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Grand Total
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦
                  {(requestDetails.lineItems || [])
                    .reduce((sum, item) => sum + (item.totalBudget || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {!!requestDetails.isJourneyManagementRequired && (
            <div>
              <h3 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
                Journey Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Mode of Transport
                  </span>
                  <span className="font-medium text-gray-900">
                    {requestDetails.modeOfTransport || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Driver's Name
                  </span>
                  <span className="font-medium text-gray-900">
                    {requestDetails.driverName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Driver's Phone Number
                  </span>
                  <span className="font-medium text-gray-900">
                    {requestDetails.driversPhoneNumber || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Vehicle Color
                  </span>
                  <span className="font-medium text-gray-900">
                    {requestDetails.vehicleColor || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Departure Date
                  </span>
                  <span className="font-medium text-gray-900">
                    {requestDetails.departureTime
                      ? formatDate(requestDetails.departureTime, "date-only")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Route
                  </span>
                  <span className="font-medium text-gray-900">
                    {requestDetails.route || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {requestDetails.documentURL && (
            <div className="print:hidden">
              <h3 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
                Supporting Document
              </h3>
              <FileDisplay
                filename={requestDetails.documentName}
                url={requestDetails.documentURL}
              />
            </div>
          )}

          <div className="print:hidden space-y-4 pt-8 border-t border-gray-300">
            <h3 className="text-base font-bold uppercase tracking-wider mb-4">
              Approval Actions
            </h3>
            <TextareaInput
              name="comment"
              label="Comment *"
              placeholder="Add your review comments here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex gap-4 pt-2">
              <Button
                content={isSubmitting ? "Submitting..." : "Reject"}
                isSecondary
                onClick={() => handleAction(2)}
                isDisabled={isSubmitting}
              />
              <Button
                content={isSubmitting ? "Submitting..." : "Review"}
                isSecondary
                onClick={() => handleAction(2)}
                isDisabled={isSubmitting}
              />
              <Button
                content={isSubmitting ? "Submitting..." : "Approve"}
                onClick={() => handleAction(3)}
                isDisabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Retirement view ──
  const req = retirementRequest;
  const ret = retirementDetails!;
  const totalBudget = (req?.lineItems || []).reduce(
    (s, i) => s + (i.totalBudget || 0),
    0,
  );
  const reimburseToNDSICDE = Math.max(0, totalBudget - (ret.actualCost || 0));
  const reimburseToStaff = Math.max(0, (ret.actualCost || 0) - totalBudget);


  return (
    <div className="mt-8 space-y-6 pb-12">
      <div className="flex justify-between items-center print:hidden">
        <Heading
          heading="Financial Retirement Details"
          subtitle={req?.activityTitle || ret.requestActivityTitle || "N/A"}
        />
        <div className="w-40 shrink-0">
          <Button
            content="Print Retirement"
            isSecondary
            onClick={() => window.print()}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white border border-gray-300 shadow-sm p-10 print:p-0 print:border-none print:shadow-none space-y-10 text-gray-900">
        {req && (
          <>
            <InternalMemorandum
              isReadOnly
              staff={req.staff}
              requestDate={
                req.requestDate ||
                (req.activityStartDate
                  ? formatDate(req.activityStartDate, "date-only")
                  : "N/A")
              }
              budgetName={req.project?.projectName || "N/A"}
              budgetCode={req.activityBudgetCode?.toString() || "N/A"}
            />

            <div>
              <h3 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
                Activity Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Output
                  </span>
                  <span className="font-medium text-gray-900">
                    {retirementOutput?.outputStatement || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Activity Title
                  </span>
                  <span className="font-medium text-gray-900">
                    {req.activityTitle || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Activity Locations
                  </span>
                  <span className="font-medium text-gray-900">
                    {req.activityLocation || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Activity Start Date
                  </span>
                  <span className="font-medium text-gray-900">
                    {req.activityStartDate
                      ? formatDate(req.activityStartDate, "date-only")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">
                    Activity End Date
                  </span>
                  <span className="font-medium text-gray-900">
                    {req.activityEndDate
                      ? formatDate(req.activityEndDate, "date-only")
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-8 text-sm">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide block mb-2">
                  Activity Purpose/Description
                </span>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded text-gray-800 leading-relaxed">
                  {req.activityPurposeDescription || "N/A"}
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <h3 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
            Retirement Details
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table
              tableHead={retirementHead}
              tableData={[ret]}
              renderRow={(row: RetirementRequestType) => {
                const diff = (row.totalBudget || 0) - (row.actualCost || 0);
                return (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      {row.activityLineDescription || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      {row.quantity || "0"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      {row.frequency || "0"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      ₦{(row.unitCost || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-gray-200">
                      ₦{(row.totalBudget || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-t border-gray-200">
                      ₦{(row.actualCost || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium border-t border-gray-200">
                      {diff < 0 ? (
                        <span className="text-red-500">
                          -₦{Math.abs(diff).toLocaleString()}
                        </span>
                      ) : diff > 0 ? (
                        <span className="text-green-500">
                          +₦{diff.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-500">₦0</span>
                      )}
                    </td>
                  </>
                );
              }}
            />
          </div>
          <div className="flex flex-col gap-2 pt-6 text-sm font-semibold text-gray-900 mt-4 text-right">
            <p>
              Total Activity Cost:{" "}
              <span className="font-bold">
                ₦{(ret.actualCost || 0).toLocaleString()}
              </span>
            </p>
            <p>
              Amount to reimburse to NDSICDE:{" "}
              <span className="font-bold">
                ₦{reimburseToNDSICDE.toLocaleString()}
              </span>
            </p>
            <p>
              Amount to reimburse to Staff:{" "}
              <span className="font-bold">
                ₦{reimburseToStaff.toLocaleString()}
              </span>
            </p>
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

        {req?.documentURL && (
          <div className="print:hidden">
            <h3 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
              Attached Documents
            </h3>
            <FileDisplay filename={req.documentName} url={req.documentURL} />
          </div>
        )}

        <div className="print:hidden space-y-4 pt-8 border-t border-gray-300">
          <h3 className="text-base font-bold uppercase tracking-wider mb-4">
            Approval Actions
          </h3>
          <TextareaInput
            name="comment"
            label="Comment *"
            placeholder="Add your review comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-4 pt-2">
            <Button
              content={isSubmitting ? "Submitting..." : "Reject"}
              isSecondary
              onClick={() => handleAction(2)}
              isDisabled={isSubmitting}
            />
            <Button
              content={isSubmitting ? "Submitting..." : "Approve"}
              onClick={() => handleAction(3)}
              isDisabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
