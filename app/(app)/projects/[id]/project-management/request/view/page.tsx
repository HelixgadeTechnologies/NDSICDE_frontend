"use client";

import { useEffect, useMemo, useState } from "react";
import Heading from "@/ui/text-heading";
import FileDisplay from "@/ui/file-display";
import Table from "@/ui/table";
import Button from "@/ui/form/button";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import { getToken } from "@/lib/api/credentials";
import { ProjectRequestResponseType, RequestLineItemType } from "@/types/project-management-types";
import { useSearchParams } from "next/navigation";
import InternalMemorandum from "@/components/project-management-components/internal-memorandum";
import SignatureComponenet from "@/ui/signature-component";
import { getUsers, UserManagementCredentials } from "@/lib/api/user-management";

/**
 * Each layer maps to one approval column (A-E) on the request record.
 * Layers 1 and 3 also have a designated approver written at request creation
 * time (`sendTo` and `sendTo2`).
 */
type LayerKey = "A" | "B" | "C" | "D" | "E";
const LAYERS: { key: LayerKey; label: string; designatedField?: "sendTo" | "sendTo2" }[] = [
  { key: "A", label: "Layer 1", designatedField: "sendTo" },
  { key: "B", label: "Layer 2" },
  { key: "C", label: "Layer 3", designatedField: "sendTo2" },
  { key: "D", label: "Layer 4" },
  { key: "E", label: "Layer 5" },
];

export default function ViewActivityRequestPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [requestDetails, setRequestDetails] = useState<ProjectRequestResponseType | null>(null);
  const [outputDetails, setOutputDetails] = useState<any>(null);
  const [users, setUsers] = useState<UserManagementCredentials[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = getToken();

  const head = [
    "Item Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total (₦)",
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      if (!requestId) return;
      setIsLoading(true);
      try {
        // Request, output, and user directory fetch in parallel — users used
        // to resolve approver / send-to user IDs into names + signatures.
        const [res, usersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/${requestId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          token
            ? getUsers(token).catch(() => ({ data: [] as UserManagementCredentials[] }))
            : Promise.resolve({ data: [] as UserManagementCredentials[] }),
        ]);
        const data = res.data.data;
        setRequestDetails(data);
        setUsers(usersRes.data ?? []);

        if (data.outputId) {
          const outputRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${data.outputId}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setOutputDetails(outputRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching request details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [requestId, token]);

  /** O(1) user lookup by id — handy for resolving approver / send-to fields. */
  const usersById = useMemo(() => {
    const map = new Map<string, UserManagementCredentials>();
    users.forEach((u) => map.set(u.userId, u));
    return map;
  }, [users]);

  /** Per-layer signature data, derived from the request + user directory.
   *  Falls back to the designated approver (sendTo / sendTo2) when nobody has
   *  signed off on that layer yet. Returns null when neither approver exists. */
  const signatureBlocks = useMemo(() => {
    if (!requestDetails) return [];
    return LAYERS.map(({ key, label, designatedField }) => {
      const approverId =
        (requestDetails[`approvedBy_${key}` as keyof ProjectRequestResponseType] as
          | string
          | null
          | undefined) ?? null;
      const designatedId = designatedField
        ? (requestDetails[designatedField] as string | null | undefined) ?? null
        : null;
      const userId = approverId || designatedId;
      if (!userId) return null;

      const user = usersById.get(userId) as
        | (UserManagementCredentials & {
            signature?: string | null;
            signatureMimeType?: string | null;
          })
        | undefined;

      const approvalDate = requestDetails[
        `approvalDate${key}` as keyof ProjectRequestResponseType
      ] as string | null | undefined;

      return {
        heading: label,
        name: user?.fullName ?? "Pending assignment",
        signature: (user?.signature ?? "") || "",
        date: approvalDate ? formatDate(approvalDate, "date-only") : "—",
      };
    }).filter((block): block is NonNullable<typeof block> => block !== null);
  }, [requestDetails, usersById]);

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

  if (!requestDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Request not found.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6 pb-12">
      <div className="flex justify-between items-center print:hidden">
        <Heading
          heading="Financial Request Details"
          subtitle={`${requestDetails.activityTitle || "N/A"} - Submitted on ${formatDate(requestDetails.activityStartDate)}`}
        />
        <div className="w-50">
          <Button content="Print Request" isSecondary onClick={() => window.print()} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white border border-gray-300 shadow-sm p-10 print:p-0 print:border-none print:shadow-none space-y-10 text-gray-900">
        
        <InternalMemorandum
          isReadOnly
          staff={requestDetails.staff}
          requestDate={requestDetails.requestDate || formatDate(requestDetails.activityStartDate, "date-only")}
          budgetName={requestDetails.project?.projectName || "N/A"}
          budgetCode={requestDetails.activityBudgetCode?.toString() || "N/A"}
        />

        <div>
          <h3 className="text-base text-gray-600 font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
            Activity Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Output</span>
              <span className="font-medium text-gray-900">{outputDetails?.outputStatement || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Activity Title</span>
              <span className="font-medium text-gray-900">{requestDetails.activityTitle || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Activity Location(s)</span>
              <span className="font-medium text-gray-900">{requestDetails.activityLocation || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Activity Start Date</span>
              <span className="font-medium text-gray-900">{requestDetails.activityStartDate ? formatDate(requestDetails.activityStartDate, "date-only") : "N/A"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Activity End Date</span>
              <span className="font-medium text-gray-900">{requestDetails.activityEndDate ? formatDate(requestDetails.activityEndDate, "date-only") : "N/A"}</span>
            </div>
          </div>
          
          <div className="mt-8 text-sm">
            <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide block mb-2">Activity Purpose/Description</span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded text-gray-800 leading-relaxed">
              {requestDetails.activityPurposeDescription || "N/A"}
            </div>
          </div>
        </div>
        {signatureBlocks.length > 0 ? (
          <div className="flex justify-center gap-x-16 gap-y-5 items-center flex-wrap">
            {signatureBlocks.map((sign, idx) => (
              <SignatureComponenet
                key={`${sign.heading}-${idx}`}
                heading={sign.heading}
                name={sign.name}
                signature={sign.signature}
                date={sign.date}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic text-center">
            No signatures added yet
          </p>
        )}

        <div>
          <h3 className="text-base text-gray-600 font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
            Budget Breakdown
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table
              tableHead={head}
              tableData={requestDetails.lineItems || []}
              height="fit-content"
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Grand Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{(requestDetails.lineItems || [])
                  .reduce((sum, item) => sum + (item.totalBudget || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {!!requestDetails.isJourneyManagementRequired && (
          <div>
            <h3 className="text-base text-gray-600 font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
              Journey Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Mode of Transport</span>
                <span className="font-medium text-gray-900">{requestDetails.modeOfTransport || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Driver's Name</span>
                <span className="font-medium text-gray-900">{requestDetails.driverName || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Driver's Phone Number</span>
                <span className="font-medium text-gray-900">{requestDetails.driversPhoneNumber || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Vehicle Color</span>
                <span className="font-medium text-gray-900">{requestDetails.vehicleColor || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Departure Date</span>
                <span className="font-medium text-gray-900">{requestDetails.departureTime ? formatDate(requestDetails.departureTime, "date-only") : "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Route</span>
                <span className="font-medium text-gray-900">{requestDetails.route || "N/A"}</span>
              </div>
            </div>
          </div>
        )}

        {requestDetails.documentURL && (
          <div className="print:hidden">
            <h3 className="text-base text-gray-600 font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
              Supporting Document(s)
            </h3>
            <FileDisplay
              filename={requestDetails.documentName}
              url={requestDetails.documentURL}
            />
          </div>
        )}
      </div>
    </div>
  );
}
