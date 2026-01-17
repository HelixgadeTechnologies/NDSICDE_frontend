"use client";

import { useForm } from "@/context/ProjectRequestContext";
import FileDisplay from "@/ui/file-display";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { formatDate } from "@/utils/dates-format-utility";

type SubmitAndReviewProps = {
  onBack?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
};

export default function SubmitAndReview({ onBack, onSubmit, isSubmitting }: SubmitAndReviewProps) {
  const { formData } = useForm();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Format dates for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return formatDate(dateString, "full");
    } catch {
      return dateString;
    }
  };

  const head = ["Activity Line Item Description", "Quantity", "Frequency", "Unit Cost", "Total (₦)"];

  // Use budgetLines array if available, otherwise create array from single line data
  const budgetLinesData = formData.budgetLines?.length > 0 
    ? formData.budgetLines 
    : formData.activityLineDescription 
      ? [{
          activityLineDescription: formData.activityLineDescription,
          quantity: formData.quantity || 0,
          frequency: formData.frequency || 0,
          unitCost: formData.unitCost || 0,
          total: formData.total || 0,
        }]
      : [];

  const data = budgetLinesData.map(line => ({
    description: line.activityLineDescription || "N/A",
    quantity: line.quantity,
    frequency: line.frequency,
    unit_cost: line.unitCost,
    total: line.total,
  }));

  // Calculate grand total from budget lines
  const grandTotal = budgetLinesData.reduce((sum, line) => sum + line.total, 0);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <section>
      <form className="space-y-6 w-full" onSubmit={handleFormSubmit}>
        <Heading heading="Review & Submit" className="text-center" />

        {/* body */}
        <section className="space-y-6 my-5">
          <Heading heading="Submission Details" />
          
          {/* Financial Request Section */}
          <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Financial Request Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Staff:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.staff || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Output ID:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.outputId || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Activity Title:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.activityTitle || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Activity Budget Code:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.activityBudgetCode || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Activity Location:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.activityLocation || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Budget Code:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.budgetCode || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Activity Start Date:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formatDateForDisplay(formData.activityStartDate)}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Activity End Date:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formatDateForDisplay(formData.activityEndDate)}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm">
                <span className="text-gray-600">Activity Purpose/Description:</span>
              </p>
              <p className="mt-1 text-gray-900">
                {formData.activityPurposeDescription || "N/A"}
              </p>
            </div>
            
            {/* Budget Lines Table */}
            {budgetLinesData.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Budget Line Items</h4>
                <Table
                  tableHead={head}
                  tableData={data}
                  renderRow={(row) => (
                    <>
                      <td className="px-6 py-3">
                        <p className="w-4/5 truncate">{row.description}</p>
                      </td>
                      <td className="px-6 py-3">{row.quantity}</td>
                      <td className="px-6 py-3">{row.frequency}</td>
                      <td className="px-6 py-3">₦{row.unit_cost.toLocaleString()}</td>
                      <td className="px-6 py-3">₦{row.total.toLocaleString()}</td>
                    </>
                  )}
                />
                
                {/* Grand Total */}
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      Grand Total: ₦{grandTotal.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Journey Management Section */}
          <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <Heading heading="Journey Management" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Mode of Transport:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.modeOfTransport || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Driver's Name:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.driverName || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Driver's Phone Number:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.driversPhoneNumber || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Vehicle Plate Number:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.vehiclePlateNumber || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Vehicle Color:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.vehicleColor || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Departure Time:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formatDateForDisplay(formData.departureTime)}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.route || "N/A"}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Recipient Phone Number:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.recipientPhoneNumber || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Supporting Documents Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <Heading heading="Supporting Documents" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm">
                  <span className="text-gray-600">Document Name:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formData.documentName || "N/A"}
                  </span>
                </p>
              </div>
            </div>
            
            {/* Project Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <span className="text-gray-600">Project ID:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {formData.projectId || "N/A"}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {formData.status || "Active"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Document Display */}
            {formData.documentURL && (
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Uploaded Document</h4>
                <FileDisplay 
                  filename={formData.documentName || "Supporting Document"} 
                  filesize="" 
                  // url={formData.documentURL}
                />
              </div>
            )}
            
            {!formData.documentURL && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No supporting document uploaded
                </p>
              </div>
            )}
          </div>
        </section>

        {/* buttons */}
        <div className="flex gap-6 items-center mt-8">
          <div className="w-2/5">
            <Button 
              isSecondary 
              content="Back" 
              onClick={handleBack}
              isDisabled={isSubmitting}
            />
          </div>
          <div className="w-3/5">
            <Button 
              content={isSubmitting ? "Submitting..." : "Submit Request"} 
              onClick={handleSubmit}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </form>
    </section>
  );
}