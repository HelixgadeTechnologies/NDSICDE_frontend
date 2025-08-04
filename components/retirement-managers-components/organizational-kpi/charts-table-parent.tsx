"use client";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import LineChartComponent from "@/ui/line-chart";
import TabComponent from "@/ui/tab-component";
import RetirementManagersChartsComponent from "./charts-section";
import RetirementManagerTableComponent from "./table-section";

export default function RetirementManagerChartsAndTableParent() {
  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  const data = [
    { code: "EDU 01", value: 70 },
    { code: "EDU 02", value: 100 },
    { code: "HEALTH 01", value: 35 },
    { code: "HEALTH 02", value: 75 },
    { code: "INFRA 01", value: 50 },
    { code: "INFRA 02", value: 90 },
  ];

  const lines = [
    {
      key: "value",
      label: "Performance",
      color: "#003B99",
    },
  ];
  return (
    <div className="space-y-5">
      {/* tabs */}
      <CardComponent>
        <TabComponent
          width="80"
          data={tabs}
          renderContent={(tabId) => {
            if (tabId === 1) {
              return <RetirementManagersChartsComponent />;
            } else {
              return <RetirementManagerTableComponent />;
            }
          }}
        />
      </CardComponent>
      {/* card and lower chart */}
      <CardComponent>
        <div className="flex justify-between items-center mb-5">
          <Heading
            heading="Project Indicator Performance (%)"
            subtitle="Percentage of target achieved"
          />
          <div className="w-[356px]">
            <CardComponent>
              <div className="flex items-center gap-1.5">
                <span className="bg-[#003B99] h-2 w-2 rounded-full"></span>
                <p className="text-gray-500 text-xs">Performance</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[15px]">
                  Average Performance for Project:
                </span>
                <span className="font-semibold text-shadow-gray-900 text-2xl">
                  200
                </span>
              </div>
            </CardComponent>
          </div>
        </div>

        {/* line chart */}
        <div className="h-72">
          <LineChartComponent
            data={data}
            lines={lines}
            legend={false}
            xKey="code"
          />
        </div>
      </CardComponent>
    </div>
  );
}
