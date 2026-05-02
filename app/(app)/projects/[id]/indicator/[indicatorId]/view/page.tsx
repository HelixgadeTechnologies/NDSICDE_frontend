"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dates-format-utility";

export default function ViewActualValue() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const projectId = params?.id as string;
  const indicatorId = params?.indicatorId as string;

  const head = [
    "Indicator Source",
    "Thematic Areas",
    "Indicator Statement",
    "Responsible Person(s)",
    "Actual Date",
    "Cumulative Actual",
    "Actions",
  ];

  useEffect(() => {
    const fetchReports = async () => {
      if (!indicatorId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicator_report/indicator/${indicatorId}`
        );
        if (response.data?.success) {
          setData(response.data.data || []);
        } else {
          console.warn("Failed to fetch reports.");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [indicatorId]);

  return (
    <section className="relative mt-12 w-full max-w-[1200px] mx-auto pb-12">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Report Actual Value"
          icon="si:add-fill"
          onClick={() => window.location.assign(`/projects/${projectId}/indicator/${indicatorId}/report`)}
        />
      </div>

      <CardComponent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <Table
            tableHead={head}
            tableData={data}
            checkbox
            idKey={"indicatorReportId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.indicatorSource || "N/A"}</td>
                <td className="px-6">{row.thematicAreasOrPillar || "N/A"}</td>
                <td className="px-6">{row.indicatorStatement || "N/A"}</td>
                <td className="px-6">{row.responsiblePersons || "N/A"}</td>
                <td className="px-6">
                  {row.actualDate ? formatDate(row.actualDate) : "N/A"}
                </td>
                <td className="px-6">{row.cumulativeActual || "N/A"}</td>
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
                          prev === row.indicatorReportId ? null : row.indicatorReportId
                        )
                      }
                    />
                  </div>
                  {activeRowId === row.indicatorReportId && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50">
                        <ul className="text-sm">
                          <li className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                            <Icon
                              icon={"ph:pencil-simple-line"}
                              height={20}
                              width={20}
                            />
                            Edit
                          </li>
                          <li className="cursor-pointer hover:text-(--primary-light) border-t border-gray-300 flex gap-2 p-3 items-center">
                            <Icon
                              icon={"pixelarticons:trash"}
                              height={20}
                              width={20}
                            />
                            Remove
                          </li>
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </td>
              </>
            )}
          />
        )}
        {!isLoading && data.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 font-medium">No reports found.</p>
          </div>
        )}
      </CardComponent>
    </section>
  );
}
