"use client";

import TitleAndContent from "@/components/super-admin-components/data-validation/title-content-component";
import FileDisplay from "@/ui/file-display";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";

type FormTwoProps = {
  onBack: () => void;
  onSubmit: () => void;
};

export default function SubmitAndReview({ onBack, onSubmit }: FormTwoProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const head = ["Activity Line Item Description","Quantity", "Frequency", "Unit Cost", "Total (₦)"];

  const data = [
    {
      description: "Lorem ipsum dolor sit amet",
      quantity: 200,
      frequency: 200,
      unit_cost: 200,
      total: 600,
    },
    {
      description: "Lorem ipsum dolor sit amet",
      quantity: 250,
      frequency: 200,
      unit_cost: 200,
      total: 650,
    },
  ];

  return (
    <section>
      <form className="space-y-6 w-full" onSubmit={handleFormSubmit}>
        <Heading heading="Review & Submit" className="text-center" />

        {/* body */}
        <section className="space-y-4 my-5">
          {/* <Heading
            heading="Financial Request"
            subtitle="Community Health Initiative - Submitted on May 15, 2023 at 10:30"
          /> */}
          <Heading heading="Submission Details"/>
          {/* submission details */}
          <div className="space-y-3 mb-5">
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Submitted by:</span>
              <span className="font-semibold text-gray-900"> John Doe</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Output:</span>
              <span className="font-semibold text-gray-900"> Output Name</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity Title:</span>
              <span className="font-semibold text-gray-900">
                {" "}
                Activity Title
              </span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity Budget Code:</span>
              <span className="font-semibold text-gray-900"> 000000</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity Locations:</span>
              <span className="font-semibold text-gray-900"> Location 1</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity Start Date:</span>
              <span className="font-semibold text-gray-900"> 12/04/2025</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Activity End Date:</span>
              <span className="font-semibold text-gray-900"> 12/04/2025</span>
            </p>
            <TitleAndContent
              title={"Activity Purpose/Description"}
              content={
                "Conducted a 2-hour workshop with the client team to gather detailed requirements for the new dashboard feature. The session was highly productive with active participation from all stakeholders."
              }
            />
            <Table
              tableHead={head}
              tableData={data}
              renderRow={(row) => (
                <>
                  <td className="px-6">
                    <p className="w-4/5 truncate">{row.description}</p>
                  </td>
                  <td className="px-6">{row.quantity}</td>
                  <td className="px-6">{row.frequency}</td>
                  <td className="px-6">{row.unit_cost}</td>
                  <td className="px-6">{row.total}</td>
                </>
              )}
            />
          </div>

          <Heading heading="Journey Management" />

          <div className="space-y-3">
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Mode of Transport:</span>
              <span className="font-semibold text-gray-900"> Road</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Driver&apos;s Name:</span>
              <span className="font-semibold text-gray-900"> John Doe</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">
                Driver&apos;s Phone Number:
              </span>
              <span className="font-semibold text-gray-900"> 09039776534</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Vehicle Color:</span>
              <span className="font-semibold text-gray-900"> Red</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Departure Date:</span>
              <span className="font-semibold text-gray-900"> 12/04/2025</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">Route:</span>
              <span className="font-semibold text-gray-900"> Red</span>
            </p>
            <p className="mb-2 text-sm">
              <span className="text-[#475367]">
                Recipient&apos;s Phone Number:
              </span>
              <span className="font-semibold text-gray-900"> 09039776534</span>
            </p>
          </div>

          {/* attached evidence */}
          <div className="my-4">
            <h3 className="text-lg font-bold text-black my-3">
              Supporting Document
            </h3>
            {/* change to array or take from endpoint */}
            <FileDisplay filename="progress_photos.zip" filesize="15.2 MB" />
          </div>
        </section>

        {/* buttons */}
        <div className="flex gap-6 items-center mt-4">
          <div className="w-2/5">
            <Button isSecondary content="Back" onClick={onBack} />
          </div>
          <div className="w-3/5">
            <Button content="Submit" onClick={onSubmit} />
          </div>
        </div>
      </form>
    </section>
  );
}
