"use client";

import Table from "@/ui/table";
// import { Icon } from "@iconify/react";
// import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";

export default function KPITable() {
  const head = [
    "KPI Name",
    "Type",
    "Baseline",
    "Target",
    "Assigned",
    "Status",
    "Actions",
  ];


  // const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [data, setData] = useState([]);

    // get strategic objectives kpi 
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpis`);
          setData(res.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, []);

  return (
    <Table
      checkbox
      idKey={"id"}
      tableHead={head}
      tableData={data}
      renderRow={(row) => (
        // <>
        //   <td className="px-6">{row.KPIName}</td>
        //   <td className="px-6">{row.type}</td>
        //   <td className="px-6">{row.baseline}</td>
        //   <td className="px-6">{row.target}</td>
        //   <td
        //     className={`px-6 ${
        //       row.assigned === "Yes" ? "text-[#22C55E]" : "text-[#EAB308]"
        //     }`}
        //   >
        //     {row.assigned}
        //   </td>
        //   <td
        //     className={`px-6 ${
        //       row.status === "Active" ? "text-[#22C55E]" : "text-[#EAB308]"
        //     }`}
        //   >
        //     {row.status}
        //   </td>
        //   <td className="px-6 relative">
        //     <div className="flex justify-center items-center">
        //       <Icon
        //         icon={"uiw:more"}
        //         width={22}
        //         height={22}
        //         className="cursor-pointer"
        //         color="#909CAD"
        //         onClick={() =>
        //           setActiveRowId((prev) => (prev === row.id ? null : row.id))
        //         }
        //       />
        //     </div>
        //     {activeRowId === row.id && (
        //       <AnimatePresence>
        //         <motion.div
        //           initial={{ y: -10, opacity: 0 }}
        //           animate={{ y: 0, opacity: 1 }}
        //           exit={{ y: -10, opacity: 0 }}
        //           transition={{ duration: 0.2, ease: "easeOut" }}
        //           className="absolute top-full mt-2 right-0 bg-white z-30 rounded-[6px] border border-[#E5E5E5] shadow-md w-[210px]"
        //         >
        //           <ul className="text-sm">
        //             <li className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center">
        //               <Icon
        //                 icon={"ph:pencil-simple-line"}
        //                 height={20}
        //                 width={20}
        //               />
        //               Edit
        //             </li>
        //             <li className="cursor-pointer hover:text-[var(--primary-light)] flex gap-2 p-3 items-center">
        //               <Icon
        //                 icon={"pixelarticons:trash"}
        //                 height={20}
        //                 width={20}
        //               />
        //               Delete
        //             </li>
        //           </ul>
        //         </motion.div>
        //       </AnimatePresence>
        //     )}
        //   </td>
        // </>
        <>{row}</>
      )}
    />
  );
}
