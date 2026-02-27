"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import BarChartComponent from "@/ui/bar-chart";

type ChartAnalyticsProps = {
  stats: {
    statusDistribution: {
      approved: number;
      rejected: number;
      pending: number;
    };
    totalApprovedAmount: number;
    totalRetiredAmount: number;
    percentAmountRetired: number;
  } | null;
};

export default function RetirementManagersChartAnalytics({ stats }: ChartAnalyticsProps) {
  const bars = [{ key: "value", label: "Category", color: "#D2091E" }];

  const barData = [
    { name: "Approved", value: stats?.statusDistribution?.approved || 0 },
    { name: "Rejected", value: stats?.statusDistribution?.rejected || 0 },
    { name: "Pending", value: stats?.statusDistribution?.pending || 0 },
  ];

  return (
    <section className="grid grid-cols-2 grid-row-2 gap-6">
      <div className="row-span-2">
        <CardComponent>
          <Heading
            heading="Request Status Distribution"
            subtitle="Overview of all request statuses"
          />
          <div className="h-[330px] mt-4">
            <BarChartComponent
              data={barData}
              xKey="name"
              bars={bars}
              legend={false}
            />
          </div>
        </CardComponent>
      </div>
      <CardComponent height="100%">
        <div className="space-y-8 text-center flex flex-col justify-center items-center h-full">
            <h3 className="text-[#737373] font-bold text-xl leading-[33.6px]">Total Project Activity Request Approved</h3>
            <h2 className="text-[#1D2739] font-extrabold text-4xl">₦ {stats?.totalApprovedAmount?.toLocaleString() || "0"}</h2>
        </div>
      </CardComponent>
      <CardComponent height="100%">
        <div className="space-y-8 text-center flex flex-col justify-center items-center h-full">
            <h3 className="text-[#737373] font-bold text-xl leading-[33.6px]">Total Project Activity Amount Retired</h3>
            <h2 className="text-[#1D2739] font-extrabold text-4xl">₦ {stats?.totalRetiredAmount?.toLocaleString() || "0"}</h2>
            <p className="text-[#22C55E] font-medium text-base">Percent Amount Retired: {stats?.percentAmountRetired || 0}%</p>
        </div>
      </CardComponent>
    </section>
  );
}
