"use client";

import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import Heading from "@/ui/text-heading";
import CPIComponent from "./cpi-component";
import SPIComponnet from "./spi-component";
import BurnRateComponent from "./burn-rate-component";
import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ActivityOverview({
  statData,
}: {
  statData?: ProjectFinancialDashboardResponse | null;
}) {
  const params = useParams();
  const projectId = (params?.id as string) || "";

  // Output options for the Burn Rate filter — fetched per project
  const [outputOptions, setOutputOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedOutputId, setSelectedOutputId] = useState<string>("");

  useEffect(() => {
    if (!projectId) return;
    const fetchOutputs = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outputs/project/${projectId}`,
        );
        const rows: { outputId: string; outputStatement: string }[] =
          res.data?.data ?? [];
        setOutputOptions([
          { label: "All Outputs", value: "" },
          ...rows.map((r) => ({
            label: r.outputStatement ?? "Untitled output",
            value: r.outputId,
          })),
        ]);
      } catch (error) {
        console.error("Failed to fetch outputs for burn rate filter:", error);
      }
    };
    fetchOutputs();
  }, [projectId]);

  // Filter the burn-rate dataset by selected output (or pass through if "All")
  const filteredBurnRate = useMemo(() => {
    const all = statData?.BURN_RATE ?? [];
    if (!selectedOutputId) return all;
    return all.filter((o) => o.outputId === selectedOutputId);
  }, [statData, selectedOutputId]);

  return (
    <>
      {/* burn rate */}
      <CardComponent>
        {/* heading and filters */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <Heading
            heading="Burn Rate"
            subtitle="Percentage of target achieved"
          />
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="w-full sm:w-64">
              <DropDown
                label="Output"
                name="output"
                placeholder="All Outputs"
                value={selectedOutputId}
                onChange={(val: string) => setSelectedOutputId(val)}
                options={outputOptions}
              />
            </div>
            <DateRangePicker label="Date Range" />
          </div>
        </div>
        {/* burn rate */}
        <BurnRateComponent burnData={filteredBurnRate} />
      </CardComponent>
      {/* cpi and spi component */}
      <CPIComponent
        data={statData?.ACTIVITY_FINANCIAL_DATA ?? []}
        outputOptions={outputOptions}
      />
      <SPIComponnet
        data={statData?.ACTIVITY_FINANCIAL_DATA ?? []}
        outputOptions={outputOptions}
      />
    </>
  );
}
