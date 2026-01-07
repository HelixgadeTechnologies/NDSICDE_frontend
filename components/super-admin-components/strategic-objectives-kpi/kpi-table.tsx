"use client";

import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";

type KPI = {
  baseLine: string;
  createAt: string;
  definition: string;
  disaggregation: string;
  itemInMeasure: string;
  kpiId: string;
  specificAreas: string;
  statement: string;
  strategicObjectiveId: string;
  target: string;
  type: string;
  unitOfMeasure: string;
  updateAt: string;
};

export default function KPITable() {
  const head = [
    "KPI Name",
    "Type",
    "Baseline",
    "Target",
    "Assigned",
    "Disaggregation", // formerly "status"
    "Actions",
  ];

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // get strategic objectives kpi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpis`
        );
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="flex justify-center items-center h-40">
        <div className="dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No KPIs objectives found.</p>
      </div>
    );
  }
  const token = getToken();
  const handleDelete = async (kpiId: string) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/deleteKpi`,
        {
          data: { kpiId: kpiId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Deleted successfully!")
    } catch (error) {
      console.error(`Error ${error}`);
      toast.error("An error occured. Please try again")
    }
  };

  return (
    <Table
      checkbox
      idKey={"kpiId"}
      tableHead={head}
      tableData={data}
      renderRow={(row) => (
        <>
          <td className="px-6">{row.statement}</td>
          <td className="px-6">{row.type}</td>
          <td className="px-6">{row.baseLine}</td>
          <td className="px-6">{row.target}</td>
          {/* might change */}
          <td className="px-6">No</td>
          <td className="px-6 capitalize">{row.disaggregation}</td>
          <td className="px-6 relative">
            <div className="flex justify-center items-center">
              <Icon
                icon={"uiw:more"}
                width={22}
                height={22}
                className="cursor-pointer"
                color="#909CAD"
                onClick={() =>
                  setActiveRowId((prev) =>
                    prev === row.kpiId ? null : row.kpiId
                  )
                }
              />
            </div>
            {activeRowId === row.kpiId && (
              <AnimatePresence>
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full mt-2 right-0 bg-white z-30 rounded-[6px] border border-[#E5E5E5] shadow-md w-[210px]">
                  <ul className="text-sm">
                    <li className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center">
                      <Icon
                        icon={"ph:pencil-simple-line"}
                        height={20}
                        width={20}
                      />
                      Edit
                    </li>
                    <li
                      onClick={() => handleDelete(row.kpiId)}
                      className="cursor-pointer hover:text-[var(--primary-light)] flex gap-2 p-3 items-center">
                      <Icon
                        icon={"pixelarticons:trash"}
                        height={20}
                        width={20}
                      />
                      Delete
                    </li>
                  </ul>
                </motion.div>
              </AnimatePresence>
            )}
          </td>
        </>
      )}
    />
  );
}
