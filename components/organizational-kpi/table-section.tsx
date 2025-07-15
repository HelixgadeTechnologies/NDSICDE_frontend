"use client";

import Table from "@/ui/table";
import DropDown from "@/ui/form/select-dropdown";
import { useOrgKPIFormState } from "@/store/organizational-kpi-store";

const head = [
    "Code",
    "Indicator",
    "Baseline",
    "Target",
    "Performance",
    "Status",
];

const data = [
    {
        code: "EDU-01",
        indicator: "Number of students enrolled",
        baseline: 500,
        target: 450,
        performance: 90,
        status: "Partially Met"
    },
    {
        code: "EDU-02",
        indicator: "Percentage of students completing training",
        baseline: 85,
        target: 88,
        performance: 103,
        status: "Met"
    },
    {
        code: "HEALTH-01",
        indicator: "Number of beneficiaries receiving health services",
        baseline: 5000,
        target: 3800,
        performance: 76,
        status: "Partially Met"
    },
];

const optionsData = [
    { value: "1", label: "Option One" },
    { value: "2", label: "Option Two" },
    { value: "3", label: "Option Three" }
]


export default function TableSection () {
    const { 
        allStrategicObjective, 
        indicators, 
        resultLevel, 
        disaggregation, 
        setField,
    } = useOrgKPIFormState();

    return (
        <section>
            <div className="flex flex-col md:flex-row mb-5 gap-4 md:items-center w-full mt-6">
                <DropDown
                label="Strategic Objective"
                value={allStrategicObjective}
                placeholder="Strategic Objective"
                name="allStrategicObjective"
                onChange={(value: string) => setField("allStrategicObjective", value)}
                options={optionsData}
                />
                <DropDown
                label="Result Level"
                value={resultLevel}
                placeholder="Impact"
                name="resultLevel"
                onChange={(value: string) => setField("resultLevel", value)}
                options={[]}
                />
                <DropDown
                label="Indicators"
                value={indicators}
                placeholder="All Indicators"
                name="indicators"
                onChange={(value: string) => setField("indicators", value)}
                options={[]}
                />
                <DropDown
                label="Disaggregation"
                value={disaggregation}
                placeholder="Sex"
                name="disaggregation"
                onChange={(value: string) => setField("disaggregation", value)}
                options={[]}
                />
            </div>
            <Table
            tableHead={head}
            tableData={data}
            renderRow={(row => {
                return (
                    <>
                        <td className="px-6 text-xs md:text-sm">{row.code}</td>
                        <td className="px-6 text-xs md:text-sm">{row.indicator}</td>
                        <td className="px-6 text-xs md:text-sm">{row.baseline}</td>
                        <td className="px-6 text-xs md:text-sm">{row.target}</td>
                        <td className="px-6 text-xs md:text-sm">{row.performance}%</td>
                        <td className={`${row.status === "Met" ? "text-[#22C55E]" : "text-[#EAB308]"} px-6 text-xs md:text-sm`}>{row.status}</td>
                    </>
                )
            })}
            />
        </section>
    )
}