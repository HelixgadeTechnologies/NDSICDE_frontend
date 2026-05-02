"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dates-format-utility";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";

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
  orgKpiId: string;
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
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorData | null>(null);

  const params = useParams();
  const router = useRouter();
  const projectId = params?.id;

  useEffect(() => {
    const fetchIndicators = async () => {
      if (!resultId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicators/resultType/${resultId}`
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

  if (selectedIndicator) {
    return (
      <div className="mt-6 space-y-4">
        <button
          onClick={() => setSelectedIndicator(null)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
        >
          <Icon icon="fluent:arrow-left-24-regular" width={16} height={16} className="mr-2" />
          Back to Indicators
        </button>

        <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-start justify-between border-b border-gray-100 pb-5 mb-5 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedIndicator.statement || "No Statement Provided"}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium text-gray-700">Source:</span>{" "}
                {selectedIndicator.indicatorSource || "N/A"}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-3 min-w-fit">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {selectedIndicator.thematicAreasOrPillar || "No Pillar"}
              </span>
              <div className="flex items-center gap-3 w-[400px]">
                <Button 
                  content="View Actuals"
                  icon="fluent:eye-24-regular"
                  isSecondary={true}
                  onClick={() => router.push(`/projects/${projectId}/indicator/${selectedIndicator.indicatorId}/view`)}
                />
                <Button 
                  content="Report Actual"
                  icon="fluent:document-add-24-regular"
                  onClick={() => {
                    const query = new URLSearchParams({
                      orgKpiId: selectedIndicator.orgKpiId || "",
                      resultTypeId: (selectedIndicator as any).resultTypeId || "",
                      indicatorSource: selectedIndicator.indicatorSource || "",
                      thematicArea: selectedIndicator.thematicAreasOrPillar || "",
                      statement: selectedIndicator.statement || "",
                      responsiblePersons: selectedIndicator.responsiblePersons || ""
                    }).toString();
                    router.push(`/projects/${projectId}/indicator/${selectedIndicator.indicatorId}/report?${query}`);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Definition
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  {selectedIndicator.definition || "N/A"}
                </p>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedIndicator.unitOfMeasure || "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Type
                  </p>
                  <p className="text-sm text-gray-800 mt-1 capitalize">
                    {selectedIndicator.targetType || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsible Persons
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  {selectedIndicator.responsiblePersons || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold text-gray-700">BASELINE</p>
                  <p className="text-xs text-gray-500">
                    {selectedIndicator.baseLineDate ? formatDate(selectedIndicator.baseLineDate) : "No Date"}
                  </p>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {selectedIndicator.cumulativeValue ?? 0}
                </p>
                {selectedIndicator.baselineNarrative && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    "{selectedIndicator.baselineNarrative}"
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold text-blue-700">TARGET</p>
                  <p className="text-xs text-blue-500">
                    {selectedIndicator.targetDate ? formatDate(selectedIndicator.targetDate) : "No Date"}
                  </p>
                </div>
                <p className="text-2xl font-semibold text-blue-900">
                  {selectedIndicator.cumulativeTarget ?? 0}
                </p>
                {selectedIndicator.targetNarrative && (
                  <p className="text-sm text-blue-600 mt-2 italic">
                    "{selectedIndicator.targetNarrative}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {selectedIndicator.IndicatorDisaggregation && selectedIndicator.IndicatorDisaggregation.length > 0 && (
            <div className="mt-8 pt-5 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Disaggregation Targets
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedIndicator.IndicatorDisaggregation.map((dis) => (
                  <div
                    key={dis.indicatorDisaggregationId}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <span className="capitalize text-gray-500 mr-2">{dis.type}:</span>
                    <span className="capitalize">{dis.category}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-blue-600 font-bold">{dis.target}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {indicators.map((indicator, index) => (
        <div
          key={indicator.indicatorId || index}
          onClick={() => setSelectedIndicator(indicator)}
          className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-2">
                 <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-medium uppercase tracking-wider">
                  {indicator.thematicAreasOrPillar || "No Pillar"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                {indicator.statement || "No Statement Provided"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Source: {indicator.indicatorSource || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-2">
               <button
                  onClick={() => setSelectedIndicator(indicator)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center"
                  title="View Details"
                >
                  <Icon icon="fluent:eye-24-regular" width={20} height={20} />
               </button>
            </div>
          </div>
          <div className="mt-4 flex gap-6 border-t border-gray-50 pt-3">
             <div>
               <p className="text-[10px] font-medium text-gray-400 uppercase">Baseline</p>
               <p className="text-sm font-semibold text-gray-800">{indicator.cumulativeValue ?? 0}</p>
             </div>
             <div>
               <p className="text-[10px] font-medium text-gray-400 uppercase">Target</p>
               <p className="text-sm font-semibold text-blue-600">{indicator.cumulativeTarget ?? 0}</p>
             </div>
          </div>
        </div>
      ))}
    </div>

  );
}
