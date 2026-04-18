"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dates-format-utility";
import { Icon } from "@iconify/react";

type IndicatorDisaggregation = {
  indicatorDisaggregationId: string;
  indicatorId: string;
  type: string;
  category: string;
  target: number;
};

type IndicatorData = {
  indicatorId: string;
  indicatorSource: string;
  thematicAreasOrPillar: string;
  statement: string;
  linkKpiToSdnOrgKpi: string;
  definition: string;
  specificArea: string;
  unitOfMeasure: string;
  itemInMeasure: string;
  baseLineDate: string;
  cumulativeValue: number;
  baselineNarrative: string;
  targetDate: string;
  cumulativeTarget: number;
  targetNarrative: string;
  targetType: string;
  responsiblePersons: string;
  IndicatorDisaggregation: IndicatorDisaggregation[];
};

export default function ViewIndicators({ resultId }: { resultId: string }) {
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIndicators = async () => {
      if (!resultId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicators/${resultId}`
        );
        if (response.data?.success) {
          setIndicators(response.data.data || []);
        } else {
          toast.error("Failed to fetch indicators.");
        }
      } catch (error) {
        console.error("Error fetching indicators:", error);
        toast.error("An error occurred while fetching indicators.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndicators();
  }, [resultId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!indicators || indicators.length === 0) {
    return (
      <div className="py-12 border border-gray-300 rounded-md flex flex-col items-center justify-center text-center w-fit mx-auto px-12 my-10">
        <Icon
          icon="fluent:document-search-24-regular"
          width={48}
          height={48}
          className="text-gray-300 mb-4"
        />
        <p className="text-gray-500 font-medium">No indicators found.</p>
        <p className="text-gray-400 text-sm mt-1">
          There are currently no indicators linked to this result.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {indicators.map((indicator, index) => (
        <div
          key={indicator.indicatorId || index}
          className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white"
        >
          <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {indicator.statement || "No Statement Provided"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">Source:</span>{" "}
                {indicator.indicatorSource || "N/A"}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {indicator.thematicAreasOrPillar || "No Pillar"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Definition
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  {indicator.definition || "N/A"}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    {indicator.unitOfMeasure || "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Type
                  </p>
                  <p className="text-sm text-gray-800 mt-1 capitalize">
                    {indicator.targetType || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsible Persons
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  {indicator.responsiblePersons || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-gray-700">BASELINE</p>
                  <p className="text-xs text-gray-500">
                    {indicator.baseLineDate ? formatDate(indicator.baseLineDate) : "No Date"}
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {indicator.cumulativeValue ?? 0}
                </p>
                {indicator.baselineNarrative && (
                  <p className="text-xs text-gray-600 mt-1 italic">
                    "{indicator.baselineNarrative}"
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-blue-700">TARGET</p>
                  <p className="text-xs text-blue-500">
                    {indicator.targetDate ? formatDate(indicator.targetDate) : "No Date"}
                  </p>
                </div>
                <p className="text-lg font-semibold text-blue-900">
                  {indicator.cumulativeTarget ?? 0}
                </p>
                {indicator.targetNarrative && (
                  <p className="text-xs text-blue-600 mt-1 italic">
                    "{indicator.targetNarrative}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {indicator.IndicatorDisaggregation && indicator.IndicatorDisaggregation.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Disaggregation Targets
              </p>
              <div className="flex flex-wrap gap-2">
                {indicator.IndicatorDisaggregation.map((dis) => (
                  <div
                    key={dis.indicatorDisaggregationId}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <span className="capitalize text-gray-500 mr-1">{dis.type}:</span>
                    <span className="capitalize">{dis.category}</span>
                    <span className="mx-1 text-gray-300">|</span>
                    <span className="text-blue-600 font-semibold">{dis.target}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
