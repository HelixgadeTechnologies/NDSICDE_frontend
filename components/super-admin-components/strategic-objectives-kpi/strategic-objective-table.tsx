"use client";

import TableWithAccordion from "@/ui/table-with-accordion";
import ActionMenu from "@/ui/action-menu";
import { useStrategicObjectivesAndKPIsModal } from "@/utils/strategic-objective-kpi-utility";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import EditKPIModal, { KPI } from "./edit-kpi-form";
import axios from "axios";
import { getStrategicObjectives } from "@/lib/api/admin-api-calls";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";
import DeleteModal from "@/ui/generic-delete-modal";
import { useStrategicObjectivesAndKPIsState } from "@/store/super-admin-store/strategic-objectives-kpi-store";
import AddStrategicObjectiveModal from "./add-strategic-objective";
import { toSentenceCase } from "@/utils/ui-utility";

type StrategicObjective = {
  createAt: string;
  linkedKpi: number;
  pillarLead: string;
  statement: string;
  status: string;
  strategicObjectiveId: string;
  thematicAreas: string;
  updateAt: string;
};

type SOWithKPIs = StrategicObjective & { kpis: KPI[] };

type SOTableProps = {
  searchQuery?: string;
  statusFilter?: string;
  typeFilter?: string;
};

export default function SOTable({
  searchQuery = "",
  statusFilter = "",
  typeFilter = "",
}: SOTableProps) {
  const head = ["Objective Name", "Number of KPIs", "Status", "Actions"];
  const childHead = ["KPI Name", "Type", "Baseline → Target", "Actions"];

  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SO deletion state
  const [soToDelete, setSoToDelete] = useState<string | null>(null);
  const [isDeletingSO, setIsDeletingSO] = useState(false);

  // KPI deletion state
  const [kpiToDelete, setKpiToDelete] = useState<string | null>(null);
  const [isDeletingKpi, setIsDeletingKpi] = useState(false);

  // KPI edit state (add is now a dedicated page route)
  const [kpiToEdit, setKpiToEdit] = useState<KPI | null>(null);
  const [showEditKpiModal, setShowEditKpiModal] = useState(false);

  const {
    editStrategicObjective,
    setEditStrategicObjective,
    handleEditSO,
  } = useStrategicObjectivesAndKPIsModal();

  const { setField, resetForm } = useStrategicObjectivesAndKPIsState();

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [objectivesData, kpisRes] = await Promise.all([
        getStrategicObjectives(),
        axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpis`,
        ),
      ]);
      setObjectives(objectivesData ?? []);
      setKpis(kpisRes.data?.data ?? []);
    } catch (err) {
      console.error("Error loading strategic objectives + KPIs:", err);
      setError("Failed to load strategic objectives");
      setObjectives([]);
      setKpis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEditSOClick = (row: StrategicObjective) => {
    setField("strategicObjectiveId", row.strategicObjectiveId);
    setField("strategicObjectiveStatement", row.statement);
    setField("thematicAreas", row.thematicAreas);
    setField("pillarLeadEmail", row.pillarLead);
    handleEditSO();
    setActiveRowId(null);
  };

  const handleDeleteSO = async () => {
    if (!soToDelete) return;
    setIsDeletingSO(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/delete`,
        {
          data: { strategicObjectiveId: soToDelete },
          headers: { "Content-Type": "application/json" },
        },
      );
      await fetchAll();
    } catch (err: any) {
      console.error("SO delete failed:", err);
      toast.error(err?.response?.data?.message || "Failed to delete objective.");
    } finally {
      setIsDeletingSO(false);
      setSoToDelete(null);
    }
  };

  // KPI actions
  const handleEditKpiClick = (kpi: KPI) => {
    setKpiToEdit(kpi);
    setShowEditKpiModal(true);
    setActiveRowId(null);
  };

  const handleDeleteKpi = async () => {
    if (!kpiToDelete) return;
    setIsDeletingKpi(true);
    try {
      const token = getToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/deleteKpi`,
        {
          data: { kpiId: kpiToDelete },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchAll();
    } catch (err) {
      console.error("KPI delete failed:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsDeletingKpi(false);
      setKpiToDelete(null);
    }
  };

  // Filter + group: each SO carries its KPIs (filtered by type + search).
  // SO row is kept if it matches statusFilter and either matches the search itself
  // or has at least one matching KPI.
  const filteredData: SOWithKPIs[] = (() => {
    const q = searchQuery.toLowerCase();

    return objectives
      .filter((so) => !statusFilter || so.status === statusFilter)
      .map((so) => {
        const linked = kpis
          .filter((k) => k.strategicObjectiveId === so.strategicObjectiveId)
          .filter((k) => !typeFilter || k.type === typeFilter)
          .filter((k) => {
            if (!q) return true;
            return (
              k.statement?.toLowerCase().includes(q) ||
              k.itemInMeasure?.toLowerCase().includes(q)
            );
          });

        return { ...so, kpis: linked };
      })
      .filter((so) => {
        // Keep SO if it matches the search itself, or has matching KPIs after filtering.
        if (!q && !typeFilter) return true;
        const soMatches =
          !q ||
          so.statement?.toLowerCase().includes(q) ||
          so.thematicAreas?.toLowerCase().includes(q);
        return soMatches || so.kpis.length > 0;
      });
  })();

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
          onClick={fetchAll}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <section>
      <TableWithAccordion<SOWithKPIs, KPI>
        tableHead={head}
        childTableHead={childHead}
        tableData={filteredData}
        childrenKey="kpis"
        persistKey="so-kpi-accordion"
        pdfTitle="Strategic Objectives & KPIs"
        emptyStateMessage="No strategic objectives found"
        emptyStateSubMessage="There are no strategic objectives matching the current filters."
        renderRow={(so) => (
          <>
            <td className="px-6 py-4 max-w-125 text-sm text-gray-800 font-medium">
              {toSentenceCase(so.statement ?? "N/A")}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700">
              {so.kpis.length} {so.kpis.length === 1 ? "KPI" : "KPIs"}
            </td>
            <td className="px-6 py-4">
              <span
                className={`text-xs font-medium ${
                  so.status === "Active"
                    ? "text-green-500"
                    : so.status === "Inactive"
                      ? "text-red-500"
                      : "text-yellow-500"
                }`}>
                {toSentenceCase(so.status ?? "Unknown")}
              </span>
            </td>
            <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center">
                <Icon
                  icon="uiw:more"
                  width={22}
                  height={22}
                  className="cursor-pointer hover:text-gray-700 transition-colors"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) =>
                      prev === so.strategicObjectiveId ? null : so.strategicObjectiveId,
                    )
                  }
                />
              </div>
              <ActionMenu
                isOpen={activeRowId === so.strategicObjectiveId}
                items={[
                  {
                    type: "link",
                    label: "Add Org KPI",
                    icon: "fluent:arrow-growth-24-regular",
                    href: `/strategic-objectives/add-kpi?soId=${so.strategicObjectiveId}`,
                  },
                  {
                    type: "button",
                    label: "Edit",
                    icon: "ph:pencil-simple-line",
                    onClick: () => handleEditSOClick(so),
                    className: "border-y border-gray-200",
                  },
                  {
                    type: "button",
                    label: "Delete",
                    icon: "pixelarticons:trash",
                    onClick: () => {
                      setSoToDelete(so.strategicObjectiveId);
                      setActiveRowId(null);
                    },
                    className: "hover:text-(--primary-light)",
                  },
                ]}
              />
            </td>
          </>
        )}
        renderChildRow={(kpi) => (
          <>
            <td className="px-6 py-3 text-sm text-gray-700 max-w-125">
              {kpi.statement ?? "—"}
            </td>
            <td className="px-6 py-3 text-sm text-gray-700">{kpi.type ?? "—"}</td>
            <td className="px-6 py-3 text-sm text-gray-700">
              <span className="text-gray-500">{kpi.cumulativeValue ?? 0}</span>{" "}
              <span className="text-gray-300">→</span>{" "}
              <span className="font-medium">{kpi.cumulativeTarget ?? 0}</span>
            </td>
            <td className="px-6 py-3 relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center">
                <Icon
                  icon="uiw:more"
                  width={22}
                  height={22}
                  className="cursor-pointer hover:text-gray-700 transition-colors"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) =>
                      prev === kpi.kpiId ? null : kpi.kpiId,
                    )
                  }
                />
              </div>
              <ActionMenu
                isOpen={activeRowId === kpi.kpiId}
                items={[
                  {
                    type: "button",
                    label: "Edit",
                    icon: "ph:pencil-simple-line",
                    onClick: () => handleEditKpiClick(kpi),
                  },
                  {
                    type: "button",
                    label: "Delete",
                    icon: "pixelarticons:trash",
                    onClick: () => {
                      setKpiToDelete(kpi.kpiId);
                      setActiveRowId(null);
                    },
                    className: "hover:text-(--primary-light) border-t border-gray-200",
                  },
                ]}
              />
            </td>
          </>
        )}
      />

      <EditKPIModal
        isOpen={showEditKpiModal}
        onClose={() => {
          setShowEditKpiModal(false);
          setKpiToEdit(null);
        }}
        kpiData={kpiToEdit}
        onSuccess={fetchAll}
      />

      <DeleteModal
        isOpen={!!soToDelete}
        onClose={() => setSoToDelete(null)}
        heading="Delete Strategic Objective"
        subtitle="Are you sure you want to delete this strategic objective? This action cannot be undone."
        onDelete={handleDeleteSO}
        isDeleting={isDeletingSO}
      />

      <DeleteModal
        isOpen={!!kpiToDelete}
        onClose={() => setKpiToDelete(null)}
        heading="Delete KPI"
        subtitle="Are you sure you want to delete this KPI? This action cannot be undone."
        onDelete={handleDeleteKpi}
        isDeleting={isDeletingKpi}
      />

      {editStrategicObjective && (
        <AddStrategicObjectiveModal
          mode="Edit"
          isOpen={editStrategicObjective}
          onClose={() => {
            setEditStrategicObjective(false);
            resetForm();
          }}
          onSubmit={() => fetchAll()}
        />
      )}
    </section>
  );
}
