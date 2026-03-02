"use client";

// import Modal from "@/ui/popup-modal";
import Button from "@/ui/form/button";
import FileDisplay from "@/ui/file-display";
import Table from "@/ui/table";
import {
  FileText,
  Calendar,
  Navigation,
  ActivityIcon,
  User,
  FileOutput,
} from "lucide-react";
import CardComponent from "@/ui/card-wrapper";
import BackButton from "@/ui/back-button";
// import DeleteModal from "@/ui/generic-delete-modal";
import TitleAndContent from "@/components/super-admin-components/data-validation/title-content-component";
import Heading from "@/ui/text-heading";
import InfoItem from "@/ui/info-item";
import { RetirementRequestType } from "@/types/retirement-request";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRequests } from "@/context/RequestsContext";

export default function FinancialRequestModal() {
  // const [rejectRequest, setRejectRequest] = useState(false);
  // const [approveRequest, setApproveRequest] = useState(false);
  // const [reviewRequest, setReviewRequest] = useState(false);

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
  const { retirements, fetchRetirements } = useRequests();
  const [retirement, setRetirement] = useState<RetirementRequestType | null>(null);
  const [outputDetails, setOutputDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRetirement = async () => {
      setIsLoading(true);
      if (!retirementId) return;

      try {
        let retirementDetails = retirements.find((r) => r.retirementId === retirementId);
        
        // Setup direct individual fetch in the future if a specific /api/retirement/retirement/{id} analogous endpoint gets built, for now rely on context data filter
        if (!retirementDetails) {
            const fetched = await fetchRetirements();
            retirementDetails = fetched.find((r) => r.retirementId === retirementId);
        }

        if (retirementDetails) setRetirement(retirementDetails || null);
      } catch (error) {
        console.error("Error finding retirement specifics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRetirement();
  }, [retirementId, retirements, fetchRetirements]);

  useEffect(() => {
    const fetchOutput = async () => {
      if (!retirement?.outputId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(
           `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${retirement.outputId}`,
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
       // if retirement is missing or fetching failed, we still want to remove loader
       setIsLoading(false);
    }
  }, [retirement]);

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

  return (
    <>
      <BackButton />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <Heading
                  heading="Financial Retirement"
                  subtitle={`${retirement.requestActivityTitle} - Submitted on ${new Date(retirement.createAt).toLocaleString()}`}
                />
              </div>
              <div className="w-50">
                <Button
                  content="Print Retirement"
                  isSecondary
                  onClick={() => window.print()}
                />
              </div>
            </div>
          </div>

          {/* grid details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Submission Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Submission Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    label="Submitted by"
                    value={retirement.requestStaff || "N/A"}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Output"
                    value={outputDetails?.outputStatement || "N/A"}
                    icon={<FileOutput className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Title"
                    value={retirement.requestActivityTitle || "N/A"}
                    icon={<ActivityIcon className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Location(s)"
                    value={retirement.activityLocation || "N/A"}
                    icon={<Navigation className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity Start Date"
                    value={retirement.activityStartDate ? new Date(retirement.activityStartDate).toLocaleDateString() : "N/A"}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoItem
                    label="Activity End Date"
                    value={retirement.activityEndDate ? new Date(retirement.activityEndDate).toLocaleDateString() : "N/A"}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </div>

                <div className="mt-6">
                  <TitleAndContent
                    title="Activity Purpose/Description"
                    content={retirement.activityPurposeDescription || "N/A"}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Supporting Documents & Actions */}
            <div className="lg:col-span-1">
              {/* Supporting Documents Card */}
              <CardComponent>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D2091E]" />
                  Supporting Document (s)
                </h3>
                <FileDisplay
                  filename={retirement.documentName}
                  url={retirement.documentURL}
                />
              </CardComponent>
            </div>
          </div>

          {/* table */}
          <CardComponent>
            <Table
              tableHead={head}
              tableData={[retirement]}
              renderRow={(row) => (
                <>
                  <td className="px-6">{row.activityLineDescription || "N/A"}</td>
                  <td className="px-6">{row.quantity || "0"}</td>
                  <td className="px-6">{row.frequency || "0"}</td>
                  <td className="px-6">{row.unitCost || "0"}</td>
                  <td className="px-6">{row.totalBudget || "0"}</td>
                  <td className="px-6">{row.actualCost || "0"}</td>
                  <td className="px-6">{ (Number(row.totalBudget) || 0) - (Number(row.actualCost) || 0) }</td>
                </>
              )}
            />
            <div className="flex justify-between items-center pt-6 px-10 text-base font-medium">
              <p>Total Activity Cost (N): 0</p>
              <p>Amount to reimburse to NDSICDE (N): 0</p>
              <p>Amount to reimburse to Staff (N): 0</p>
            </div>
          </CardComponent>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-3 w-[500px]">
        <Button
          content="Approve"
          // onClick={() => setApproveRequest(true)}
        />
        <Button
          content="Review"
          isSecondary
          // onClick={() => setReviewRequest(true)}
        />
        <Button
          content="Reject"
          isSecondary
          // onClick={() => setRejectRequest(true)}
        />
      </div>

      {/* Reject Modal */}
      {/* <DeleteModal
        isOpen={rejectRequest}
        onClose={() => setRejectRequest(false)}
        heading="Do you want to delete this Request"
      /> */}

      {/* Approve Modal */}
      {/* <Modal isOpen={approveRequest} onClose={() => setApproveRequest(false)}>
        <div className="flex flex-col gap-4 items-center p-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <Icon
              icon="simple-line-icons:check"
              height={48}
              width={48}
              color="#27AE60"
            />
          </div>
          <Heading
            heading="Congratulations!"
            subtitle="Request successfully approved!"
          />
          <Button content="Close" onClick={() => setApproveRequest(false)} />
        </div>
      </Modal> */}

      {/* review modal */}
      {/* <Modal
        isOpen={reviewRequest}
        onClose={() => setReviewRequest(false)}
        maxWidth="500px">
        <div className="space-y-6">
          <TextareaInput
            label="Review Comment"
            name="reviewComment"
            onChange={() => {}}
            value=""
            placeholder="Enter comment describing what needs to be reviewed by the request initiator"
          />
          <Button
            content="Enter Comment"
            onClick={() => setReviewRequest(false)}
          />
        </div>
      </Modal> */}
    </>
  );
}