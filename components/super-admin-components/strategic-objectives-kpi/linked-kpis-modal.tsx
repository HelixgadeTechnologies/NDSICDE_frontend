"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { formatDate } from "@/utils/dates-format-utility";

type LinkedKPI = {
  kpiId: string;
  statement: string;
  definition: string;
  type: string;
  specificAreas: string;
  unitOfMeasure: string;
  itemInMeasure: string;
  disaggregation: string;
  baseLine: string;
  target: string;
  strategicObjectiveId: string;
  createAt: string;
  updateAt: string;
};

type LinkedKPIsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  strategicObjectiveId: string;
};

export default function LinkedKPIsModal({
  isOpen,
  onClose,
  strategicObjectiveId,
}: LinkedKPIsModalProps) {
  const [kpis, setKpis] = useState<LinkedKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkedKPIs = async () => {
      if (!strategicObjectiveId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpi/stId/${strategicObjectiveId}`
        );
        setKpis(response.data.data);
      } catch (error: any) {
        console.error("Error fetching linked KPIs:", error);
        setError("Failed to load linked KPIs");
        setKpis([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchLinkedKPIs();
    }
  }, [isOpen, strategicObjectiveId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px">
      <Heading heading="Linked KPIs" subtitle="KPIs associated with this strategic objective" />
      
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        ) : kpis.length === 0 ? (
          <div className="p-8 text-center">
            <Icon
              icon="fluent:document-search-24-regular"
              width={48}
              height={48}
              className="mx-auto mb-3 text-gray-400"
            />
            <p className="text-gray-500">No KPIs linked to this objective yet.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {kpis.map((kpi) => (
              <div
                key={kpi.kpiId}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{kpi.statement}</h3>
                  <span className="text-xs text-gray-500 ml-4 shrink-0">
                    {formatDate(kpi.createAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{kpi.definition}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}