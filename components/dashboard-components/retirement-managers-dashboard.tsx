"use client";

import RetirementManagersChartAnalytics from "@/components/retirement-managers-components/dashboard/chart-analytics";
import DashboardStat from "@/ui/dashboard-stat-card";
import RequestApprovalsTable from "../admin-components/request-approval-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type DashboardStats = {
  pendingRequests: {
    count: number;
    percentageChange: number;
  };
  awaitingApproval: {
    count: number;
    percentageChange: number;
  };
  retirementRequests: {
    count: number;
    percentageChange: number;
  };
  statusDistribution: {
    approved: number;
    rejected: number;
    pending: number;
  };
  totalApprovedAmount: number;
  totalRetiredAmount: number;
  percentAmountRetired: number;
};

export default function RetirementManagersDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/stats`,
        );
        if (response.data.success) {
          setStats(response.data.data);
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const dashboardData = [
    {
      title: "Pending Request",
      value: stats?.pendingRequests.count || 0,
      percentage: stats?.pendingRequests.percentageChange || 0,
      percentInfo: "since last week",
      icon: "et:piechart",
    },
    {
      title: "Awaiting Approval",
      value: stats?.awaitingApproval.count || 0,
      percentage: stats?.awaitingApproval.percentageChange || 0,
      percentInfo: "since last week",
      icon: "weui:time-outlined",
    },
    {
      title: "Retirement Request",
      value: stats?.retirementRequests.count || 0,
      percentage: stats?.retirementRequests.percentageChange || 0,
      percentInfo: "since last week",
      icon: "duo-icons:approved",
    },
  ];
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>
      <RetirementManagersChartAnalytics stats={stats} />
      <RequestApprovalsTable showStats={false} />
    </section>
  );
}
