"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { toSentenceCase } from "@/utils/ui-utility";

type ViewKPIModalProps = {
  isOpen: boolean;
  onClose: () => void;
  kpiId: string;
};

export default function ViewKPIModal({ isOpen, onClose, kpiId }: ViewKPIModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    let isMounted = true;
    const fetchKPI = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/report/${kpiId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (isMounted) setData(response.data.data);
      } catch (error) {
        console.error("Error fetching KPI details:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (kpiId && token && isOpen) {
      fetchKPI();
    }
    return () => { isMounted = false; };
  }, [kpiId, token, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="800px">
      <Heading heading="View KPI Report" subtitle="Details about this KPI report" />
      <div className="h-130 overflow-auto custom-scrollbar">
        {loading ? (
          <div className="dots my-20 mx-auto">
            <div></div><div></div><div></div>
          </div>
        ) : !data ? (
          <p className="text-red-500 mt-4 text-center">Failed to load KPI details.</p>
        ) : (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-100 p-4 rounded-md">
                <span className="text-gray-500 text-sm">KPI Name</span>
                <p className="font-medium">{data.kpiName || "N/A"}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-md">
                <span className="text-gray-500 text-sm">KPI Type</span>
                <p className="font-medium">{data.kpiType || "N/A"}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-md">
                <span className="text-gray-500 text-sm">Project</span>
                <p className="font-medium">{data.project?.projectName || "N/A"}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-md">
                <span className="text-gray-500 text-sm">Strategic Objective</span>
                <p className="font-medium">{data.strategicObjective?.statement || "N/A"}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-md">
                <span className="text-gray-500 text-sm">Baseline</span>
                <p className="font-medium">{data.baseline !== undefined ? data.baseline : "N/A"}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-md">
                <span className="text-gray-500 text-sm">Target</span>
                <p className="font-medium">{data.target !== undefined ? data.target : "N/A"}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-md">
                <span className="text-gray-500 text-sm">Actual Value</span>
                <p className="font-medium">{data.actualValue !== undefined ? data.actualValue : "N/A"}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-md">
                <span className="text-gray-500 text-sm">Status</span>
                <p className="font-medium">{toSentenceCase(data.status ?? "N/A")}</p>
              </div>
            </div>
            
            <div className="border border-gray-100 p-4 rounded-md w-full">
              <span className="text-gray-500 text-sm">Narrative / Observations</span>
              <p className="font-medium whitespace-pre-wrap">{data.observation || data.narrative || "N/A"}</p>
            </div>

            {data.evidence && (
              <div className="border border-gray-100 p-4 rounded-md w-full">
                <span className="text-gray-500 text-sm block mb-2">Supporting Evidence</span>
                <a href={data.evidence} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                  {data.evidence}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
