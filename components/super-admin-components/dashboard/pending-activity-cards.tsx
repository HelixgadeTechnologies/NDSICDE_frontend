"use client";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import ActivitySummaryCard from "./activity-summary";
import { pendingActivityFundRequest, pendingReportApproval } from "@/lib/config/charts";
import { useEffect, useState } from "react";
import axios from "axios";

type PendingActivityFundType = {
   requestId: string;
   title: string;
   projectName: string;
   status: string;
   createdAt: string;
   timeAgo: string;
   type?: string;
}

type PendingReportApprovalType = {
  reportId: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  timeAgo: string;
}

export default function PendingActivityCards() {
  const [pendingFunds, setPendingFunds] = useState<PendingActivityFundType[]>([]);
  const [pendingReports, setPendingReports] = useState<PendingReportApprovalType[]>([]);
  const [loadingFunds, setLoadingFunds] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchPendingActivityFund = async () => {
      setLoadingFunds(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard-overview/pending-fund-requests?limit=5`);
        setPendingFunds(res.data.data || []);
      } catch (error) {
        console.error("Error fetching pending fund requests:", error);
      } finally {
        setLoadingFunds(false);
      }
    }

    const fetchPendingReportApproval = async() => {
      setLoadingReports(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard-overview/pending-report-approvals?limit=5`);
        setPendingReports(res.data.data || []);
      } catch (error) {
        console.error("Error fetching pending report approvals:", error);
      } finally {
        setLoadingReports(false);
      }
    }

    fetchPendingActivityFund();
    fetchPendingReportApproval();
  }, [])

  return (
    <section className="flex gap-7 items-start w-4/5">
      <CardComponent className="flex-1">
        <Heading heading="Pending Activity Fund Request" />
        {loadingFunds ? (
          <div className="flex justify-center items-center h-32">
            <div className="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : pendingFunds.length <= 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-gray-700">No pending requests found.</p>
            <p className="text-xs text-gray-500">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-3">
            {pendingFunds.slice(0, 4).map((request) => (
              <ActivitySummaryCard 
                key={request.requestId}
                title={request.title}
                project={request.projectName}
                type={request.type || "Fund"}
                status={request.status}
              />
            ))}
          </div>
        )}
      </CardComponent>

      <CardComponent className="flex-1">
        <Heading heading="Pending Report Approval" />
        {loadingReports ? (
          <div className="flex justify-center items-center h-32">
            <div className="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : pendingReports.length <= 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-gray-700">No pending approvals found.</p>
            <p className="text-xs text-gray-500">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-3">
            {pendingReports.slice(0, 4).map((request) => (
              <ActivitySummaryCard 
                key={request.reportId}
                title={request.title}
                project={request.timeAgo}
                type={request.type}
                status={request.status}
              />
            ))}
          </div>
        )}
        <Button content="View All Approval" href="/data-validation" />
      </CardComponent>
    </section>
  );
}
