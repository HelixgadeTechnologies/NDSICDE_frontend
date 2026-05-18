"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import CardComponent from "@/ui/card-wrapper";
import Table from "@/ui/table";
import Button from "@/ui/form/button";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import InfoItem from "@/ui/info-item";
import FileDisplay from "@/ui/file-display";
import TitleAndContent from "@/components/super-admin-components/data-validation/title-content-component";
import InternalMemorandum from "@/components/project-management-components/internal-memorandum";
import {
  Calendar,
  MapPin,
  User,
  Phone,
  FileText,
  DollarSign,
  Paintbrush,
  BusFront,
  FileOutput,
  ActivityIcon,
  Navigation,
} from "lucide-react";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import { getToken } from "@/lib/api/credentials";
import { useRoleStore } from "@/store/role-store";
import { toast } from "react-toastify";
import { ProjectRequestResponseType, RequestLineItemType } from "@/types/project-management-types";
import { RetirementRequestType } from "@/types/retirement-request";

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

  const [requestDetails, setRequestDetails] = useState<ProjectRequestResponseType | null>(null);
  const [outputDetails, setOutputDetails] = useState<any>(null);

  const [retirementDetails, setRetirementDetails] = useState<RetirementRequestType | null>(null);
  const [retirementRequest, setRetirementRequest] = useState<ProjectRequestResponseType | null>(null);
  const [retirementOutput, setRetirementOutput] = useState<any>(null);

  const lineItemHead = ["Item Line Description", "Quantity", "Frequency", "Unit Cost (₦)", "Total (₦)"];
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

  // approvalStatus: 2 = reject, 3 = in review
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      toast.success(approvalStatus === 2 ? "Request rejected." : "Marked for review.");
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

  // ── Request view ──
  if (type === "request" && requestDetails) {
    return (
      <div className="mt-12 space-y-7 pb-12">
        <div className="flex justify-between items-center print:hidden">
          <Heading
            heading="Financial Request Details"
            subtitle={`${requestDetails.activityTitle || "N/A"} — Submitted on ${formatDate(requestDetails.activityStartDate)}`}
          />
          <div className="w-40 shrink-0">
            <Button content="Print Request" isSecondary onClick={() => window.print()} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* ── Left (2/3): memo + activity + budget ── */}
          <div className="lg:col-span-2 space-y-7">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Activity Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="Output"
                  value={outputDetails?.outputStatement || "N/A"}
                  icon={<FileOutput className="w-4 h-4" />}
                />
                <InfoItem
                  label="Activity Title"
                  value={requestDetails.activityTitle}
                  icon={<ActivityIcon className="w-4 h-4" />}
                />
                <InfoItem
                  label="Activity Location(s)"
                  value={requestDetails.activityLocation}
                  icon={<Navigation className="w-4 h-4" />}
                />
                <InfoItem
                  label="Activity Start Date"
                  value={formatDate(requestDetails.activityStartDate, "date-only")}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoItem
                  label="Activity End Date"
                  value={formatDate(requestDetails.activityEndDate, "date-only")}
                  icon={<Calendar className="w-4 h-4" />}
                />
              </div>
              <div className="mt-6">
                <TitleAndContent
                  title="Activity Purpose/Description"
                  content={requestDetails.activityPurposeDescription}
                />
              </div>
            </div>

            <CardComponent>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#D2091E]" />
                Budget Breakdown
              </h3>
              <Table
                tableHead={lineItemHead}
                tableData={requestDetails.lineItems || []}
                renderRow={(row: RequestLineItemType) => (
                  <>
                    <td className="px-6 py-4 text-sm">
                      <p className="w-40 truncate">{row.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{row.quantity}</td>
                    <td className="px-6 py-4 text-sm">{row.frequency}</td>
                    <td className="px-6 py-4 text-sm">₦{row.unitCost?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      ₦{row.totalBudget?.toLocaleString() || 0}
                    </td>
                  </>
                )}
              />
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Grand Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦
                    {(requestDetails.lineItems || [])
                      .reduce((sum, item) => sum + (item.totalBudget || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </CardComponent>
          </div>

          {/* ── Right (1/3): journey + document + comment + actions ── */}
          <div className="space-y-7">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Journey Management</h3>
              {!!requestDetails.isJourneyManagementRequired ? (
                <div className="grid grid-cols-1 gap-6">
                  <InfoItem
                    label="Mode of Transport"
                    value={requestDetails.modeOfTransport}
                    icon={<BusFront className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Driver's Name"
                    value={requestDetails.driverName}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Driver's Phone Number"
                    value={requestDetails.driversPhoneNumber}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Vehicle Color"
                    value={requestDetails.vehicleColor}
                    icon={<Paintbrush className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Departure Date"
                    value={formatDate(requestDetails.departureTime, "date-only")}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Route"
                    value={requestDetails.route}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Journey management was omitted for this request.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D2091E]" />
                Supporting Document
              </h3>
              {requestDetails.documentURL ? (
                <FileDisplay
                  filename={requestDetails.documentName}
                  url={requestDetails.documentURL}
                />
              ) : (
                <p className="text-sm text-gray-500">No document attached.</p>
              )}
            </div>

            {/* Comment + actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Approval Actions</h3>
              <TextareaInput
                name="comment"
                label="Comment *"
                placeholder="Add your review comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex flex-col gap-3 pt-1">
                <Button
                  content={isSubmitting ? "Submitting..." : "Reject"}
                  isSecondary
                  onClick={() => handleAction(2)}
                  isDisabled={isSubmitting}
                />
                <Button
                  content={isSubmitting ? "Submitting..." : "Review"}
                  onClick={() => handleAction(3)}
                  isDisabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Retirement view ──
  const req = retirementRequest;
  const ret = retirementDetails!;
  const totalBudget = (req?.lineItems || []).reduce((s, i) => s + (i.totalBudget || 0), 0);
  const reimburseToNDSICDE = Math.max(0, totalBudget - (ret.actualCost || 0));
  const reimburseToStaff = Math.max(0, (ret.actualCost || 0) - totalBudget);

  return (
    <div className="mt-12 space-y-7 pb-12">
      <Heading
        heading="Financial Retirement Details"
        subtitle={req?.activityTitle || ret.requestActivityTitle || "N/A"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* ── Left (2/3): memo + activity + retirement table ── */}
        <div className="lg:col-span-2 space-y-7">
          {req && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Activity Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    label="Output"
                    value={retirementOutput?.outputStatement || "N/A"}
                    icon={<FileOutput className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Title"
                    value={req.activityTitle || "N/A"}
                    icon={<ActivityIcon className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Locations"
                    value={req.activityLocation || "N/A"}
                    icon={<Navigation className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Start Date"
                    value={
                      req.activityStartDate
                        ? formatDate(req.activityStartDate, "date-only")
                        : "N/A"
                    }
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity End Date"
                    value={
                      req.activityEndDate ? formatDate(req.activityEndDate, "date-only") : "N/A"
                    }
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </div>
                <div className="mt-6">
                  <TitleAndContent
                    title="Activity Purpose/Description"
                    content={req.activityPurposeDescription || "N/A"}
                  />
                </div>
              </div>
            </>
          )}

          <CardComponent>
            <Table
              tableHead={retirementHead}
              tableData={[ret]}
              renderRow={(row: RetirementRequestType) => {
                const diff = (row.totalBudget || 0) - (row.actualCost || 0);
                return (
                  <>
                    <td className="px-6">{row.activityLineDescription || "N/A"}</td>
                    <td className="px-6">{row.quantity || "0"}</td>
                    <td className="px-6">{row.frequency || "0"}</td>
                    <td className="px-6">₦{(row.unitCost || 0).toLocaleString()}</td>
                    <td className="px-6 font-semibold">
                      ₦{(row.totalBudget || 0).toLocaleString()}
                    </td>
                    <td className="px-6">₦{(row.actualCost || 0).toLocaleString()}</td>
                    <td className="px-6 font-medium">
                      {diff < 0 ? (
                        <span className="text-red-500">-₦{Math.abs(diff).toLocaleString()}</span>
                      ) : diff > 0 ? (
                        <span className="text-green-500">+₦{diff.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-500">₦0</span>
                      )}
                    </td>
                  </>
                );
              }}
            />
            <div className="flex flex-wrap justify-between items-center pt-6 px-4 text-sm font-medium text-gray-700 gap-3">
              <p>Total Activity Cost: ₦{(ret.actualCost || 0).toLocaleString()}</p>
              <p>Reimburse to NDSICDE: ₦{reimburseToNDSICDE.toLocaleString()}</p>
              <p>Reimburse to Staff: ₦{reimburseToStaff.toLocaleString()}</p>
            </div>
          </CardComponent>
        </div>

        {/* ── Right (1/3): document + comment + actions ── */}
        <div className="space-y-7">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D2091E]" />
              Attached Documents
            </h3>
            {req?.documentURL ? (
              <FileDisplay filename={req.documentName} url={req.documentURL} />
            ) : (
              <p className="text-sm text-gray-500">No documents attached.</p>
            )}
          </div>

          {/* Comment + actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Approval Actions</h3>
            <TextareaInput
              name="comment"
              label="Comment *"
              placeholder="Add your review comments here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex flex-col gap-3 pt-1">
              <Button
                content={isSubmitting ? "Submitting..." : "Reject"}
                isSecondary
                onClick={() => handleAction(2)}
                isDisabled={isSubmitting}
              />
              <Button
                content={isSubmitting ? "Submitting..." : "Review"}
                onClick={() => handleAction(3)}
                isDisabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
