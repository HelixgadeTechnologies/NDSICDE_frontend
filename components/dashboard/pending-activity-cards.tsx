"use client";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import ActivitySummaryCard from "./activity-summary";
import { pendingActivityFundRequest, pendingReportApproval } from "@/lib/config/charts";

export default function PendingActivityCards() {
  return (
    <section className="flex gap-7 items-center w-4/5">
      <CardComponent>
        <Heading heading="Pending Activity Fund Request" />
        {pendingActivityFundRequest.length <= 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-lg text-gray-700">No pending requests found.</p>
            <p className="text-xs text-gray-500">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-3">
            {pendingActivityFundRequest.slice(0, 4).map((request) => (
              <ActivitySummaryCard 
              key={request.id}
              title={request.title}
              project={request.project}
              type={request.type}
              status={request.status}
              />
            ))}
          </div>
        )}
        <Button content="View All Requests" />
      </CardComponent>

      <CardComponent>
        <Heading heading="Pending Report Approval" />
        {pendingActivityFundRequest.length <= 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-lg text-gray-700">No pending requests found.</p>
            <p className="text-xs text-gray-500">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-3">
            {pendingReportApproval.slice(0, 4).map((request) => (
              <ActivitySummaryCard 
              key={request.id}
              title={request.title}
              project={request.project}
              type={request.type}
              status={request.status}
              />
            ))}
          </div>
        )}
        <Button content="View All Approval" href="/admin/dashboard/pending-approvals" />
      </CardComponent>
    </section>
  );
}
