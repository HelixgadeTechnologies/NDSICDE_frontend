"use client";
import { useState } from "react";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import BarChartComponent from "../../ui/bar-chart";

type ViewMode = "quarter" | "year";

export default function ChartsComponent({
  chartData,
  bars,
  availableYears = [2024, 2025],
}: {
  chartData: { name: string; baseline: number; target: number; actual: number }[];
  bars: { key: string; label: string; color: string }[];
  availableYears?: number[];
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("year");
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

  // Month labels
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Calculate yearly baseline (sum of all months)
  const yearlyBaseline = chartData.reduce((sum, item) => sum + item.baseline, 0);

  // Transform data based on view mode
  const getDisplayData = () => {
    if (viewMode === "year") {
      // Year view: 12 months (target & actual only)
      return chartData.map((item, index) => ({
        name: monthLabels[index] || item.name,
        target: item.target,
        actual: item.actual,
      }));
    }

    // Quarter view: group months into 4 quarters
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    return quarters.map((quarter, index) => {
      const monthsInQuarter = chartData.slice(index * 3, (index + 1) * 3);
      return {
        name: quarter,
        target: monthsInQuarter.reduce((sum, m) => sum + m.target, 0),
        actual: monthsInQuarter.reduce((sum, m) => sum + m.actual, 0),
      };
    });
  };

  // Only show target & actual bars (baseline moved to text)
  const getDisplayBars = () =>
    bars.filter((bar) => bar.key === "target" || bar.key === "actual");

  return (
    <section>
      <CardComponent>
        {/* Header section */}
        <div className="flex items-center justify-between mb-6">
          <Heading heading="Key Performance Indicator Overview" />

          <div className="flex items-center gap-4">
            {/* Year Dropdown */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="year-select"
                className="text-sm font-medium text-gray-700"
              >
                Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("quarter")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "quarter"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Quarter
              </button>
              <button
                onClick={() => setViewMode("year")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "year"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Year
              </button>
            </div>
          </div>
        </div>

        {/* Chart section */}
        <div className="h-[417px]">
          <BarChartComponent
            data={getDisplayData()}
            xKey="name"
            bars={getDisplayBars()}
          />
        </div>

        {/* Baseline info */}
        <div className="mt-4 text-sm text-gray-700 text-center">
          <span className="font-medium">Baseline:</span>{" "}
          {yearlyBaseline.toLocaleString()} units (cumulative for {selectedYear})
        </div>
      </CardComponent>
    </section>
  );
}