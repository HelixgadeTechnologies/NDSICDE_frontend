"use client";

import LineChartComponent from "@/ui/line-chart";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";

function BurnRateChart() {
  const burnRate = [
    { normal: 60, name: "Target 1" },
    { normal: 70, name: "Target 2" },
    { normal: 50, name: "Target 3" },
    { normal: 85, name: "Target 4" },
    { normal: 55, name: "Target 5" },
    { normal: 70, name: "Target 6" },
  ];

  return (
    <div className="h-[260px] mt-5">
      <LineChartComponent
        data={burnRate}
        lines={[{ key: "normal", label: "Normal", color: "#D2091E" }]}
        xKey="name"
      />
    </div>
  );
}

function BurnRateTable () {
    const head = ["Target", "Output", "Activity", "Status"];
    const data = [
        {
            id: "1",
            target: "Target 1",
            output: "Output 1",
            activity: "Activity 1",
            status: "Completed",
        },
        {
            id: "2",
            target: "Target 1",
            output: "Output 1",
            activity: "Activity 1",
            status: "Completed",
        },
    ];
    return (
        <Table
        tableHead={head}
        tableData={data}
        checkbox
        idKey={"id"}
        renderRow={(row) => (
            <>
            <td className="px-6">{row.target}</td>
            <td className="px-6">{row.activity}</td>
            <td className="px-6">{row.output}</td>
            <td className="px-6">{row.status}</td>
            </>
        )}
        />
    )
}

export default function BurnRateComponent() {
  return (
    <div className="mt-6">
        <TabComponent
          data={[
            { tabName: "Chart", id: 1 },
            { tabName: "Table", id: 2 },
          ]}
          renderContent={(rowId) => {
            if (rowId === 1) {
              return <BurnRateChart />;
            } else {
              return <BurnRateTable/>;
            }
          }}
        />
    </div>
  );
}
