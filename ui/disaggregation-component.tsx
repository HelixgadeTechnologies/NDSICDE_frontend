"use client";

import { useState, useEffect } from "react";
import Checkbox from "@/ui/form/checkbox";
import DropDown from "./form/select-dropdown";
import naija from "naija-state-local-government";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import { IndicatorDisaggregationItem } from "@/types/indicator";

// ─── Disaggregation type definitions ──────────────────────────────────────────

const DISAGG_TYPES = [
  "Gender & Social Inclusion",
  "Age",
  "State",
  "Year",
  "Thematic Area",
  "Donor Type",
  "Policy Action Type",
  "Institution Type",
  "Sector",
  "None",
] as const;

type DisaggType = (typeof DISAGG_TYPES)[number];

/** Fixed categories that are always shown (not user-selected) */
const FIXED_CATEGORIES: Partial<Record<DisaggType, string[]>> = {
  "Gender & Social Inclusion": ["Male", "Female", "PwDs"],
  Age: ["Below 18", "18–35", "36–50", "50+"],
  "Donor Type": ["Bilateral", "Multilateral"],
  "Policy Action Type": ["Legislative", "Administrative"],
  "Institution Type": [
    "MDAs",
    "Legislators",
    "Executive",
    "Community Leadership",
    "CDC",
    "Regional Body",
    "LGA Council",
    "CSOs",
  ],
  Sector: ["Environment", "Economy", "Climate Change", "Health", "Education"],
};

/** Types where the user picks categories from a dropdown and adds them as rows */
const PICK_AND_ADD_TYPES: DisaggType[] = [
  "State",
  "Year",
  "Thematic Area",
];

function getDropdownOptions(type: DisaggType) {
  switch (type) {
    case "State":
      return (naija.states() as string[]).map((s) => ({ label: s, value: s }));
    case "Year":
      return Array.from({ length: 12 }, (_, i) => {
        const y = (2015 + i).toString() + (i === 11 ? "+" : "");
        return { label: y, value: y };
      });
    case "Thematic Area":
      return THEMATIC_AREAS_OPTIONS;
    default:
      return [];
  }
}

// ─── Row type (one category entry) ────────────────────────────────────────────

type DisaggRow = {
  category: string;
  value: string; // baseline input (string so input is controlled)
  target: string; // target input
};

// ─── Component props ───────────────────────────────────────────────────────────

type DisaggregationComponentProps = {
  cumulativeValue?: string | number;
  cumulativeTarget?: string | number;
  onChange?: (items: Omit<IndicatorDisaggregationItem, "indicatorDisaggregationId" | "indicatorId">[]) => void;
};

// ─── Small helper ──────────────────────────────────────────────────────────────

function sumRows(rows: DisaggRow[], field: "value" | "target") {
  return rows.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0);
}

function ValidationBadge({
  sum,
  total,
  label,
}: {
  sum: number;
  total: number;
  label: string;
}) {
  if (!total) return null;
  const diff = total - sum;
  const ok = Math.abs(diff) < 0.001;
  const over = diff < 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        ok
          ? "bg-green-50 text-green-700 border border-green-200"
          : over
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      {ok ? (
        <>✓ {label} matches</>
      ) : over ? (
        <>⚠ {label} over by {Math.abs(diff).toLocaleString()}</>
      ) : (
        <>{diff.toLocaleString()} remaining in {label}</>
      )}
    </span>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function DisaggregationComponent({
  cumulativeValue,
  cumulativeTarget,
  onChange,
}: DisaggregationComponentProps) {
  const [checkboxes, setCheckboxes] = useState<boolean[]>(
    Array(DISAGG_TYPES.length).fill(false)
  );

  // For each disagg type, maintain a list of rows
  const [rows, setRows] = useState<Record<string, DisaggRow[]>>({});

  // For pick-and-add: which option is currently selected in the dropdown
  const [pickedOption, setPickedOption] = useState<Record<string, string>>({});

  const cumVal = parseFloat(String(cumulativeValue)) || 0;
  const cumTgt = parseFloat(String(cumulativeTarget)) || 0;

  // Derive checked labels (excluding "None")
  const checkedTypes = DISAGG_TYPES.filter(
    (_, i) => checkboxes[i] && DISAGG_TYPES[i] !== "None"
  );

  // ── Initialise rows when a type is first checked ──────────────────────────
  useEffect(() => {
    setRows((prev) => {
      const next = { ...prev };
      DISAGG_TYPES.forEach((type, i) => {
        if (type === "None") return;
        if (checkboxes[i] && !next[type]) {
          const fixed = FIXED_CATEGORIES[type];
          if (fixed) {
            next[type] = fixed.map((cat) => ({
              category: cat,
              value: "",
              target: "",
            }));
          } else {
            next[type] = []; // pick-and-add starts empty
          }
        }
        if (!checkboxes[i]) {
          delete next[type];
        }
      });
      return next;
    });
  }, [checkboxes]);

  // ── Notify parent whenever rows change ────────────────────────────────────
  useEffect(() => {
    if (!onChange) return;
    const items: Omit<IndicatorDisaggregationItem, "indicatorDisaggregationId" | "indicatorId">[] = [];
    Object.entries(rows).forEach(([type, typeRows]) => {
      typeRows.forEach((row) => {
        items.push({
          type: type.toLowerCase(),
          category: row.category,
          value: parseFloat(row.value) || 0,
          target: parseFloat(row.target) || 0,
        });
      });
    });
    onChange(items);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // ── Checkbox toggle ───────────────────────────────────────────────────────
  const toggleCheckbox = (index: number) => {
    const isNone = DISAGG_TYPES[index] === "None";
    setCheckboxes((prev) => {
      if (isNone) {
        const noneState = !prev[index];
        return prev.map((_, i) => (i === index ? noneState : false));
      }
      const next = [...prev];
      next[index] = !next[index];
      next[DISAGG_TYPES.length - 1] = false; // uncheck "None"
      return next;
    });
  };

  // ── Row field update ──────────────────────────────────────────────────────
  const updateRow = (
    type: string,
    rowIndex: number,
    field: "value" | "target",
    val: string
  ) => {
    setRows((prev) => {
      const typeRows = [...(prev[type] ?? [])];
      typeRows[rowIndex] = { ...typeRows[rowIndex], [field]: val };
      return { ...prev, [type]: typeRows };
    });
  };

  // ── Pick-and-add: add a selected option as a new row ─────────────────────
  const addPickedRow = (type: string) => {
    const selected = pickedOption[type];
    if (!selected) return;
    setRows((prev) => {
      const typeRows = prev[type] ?? [];
      if (typeRows.some((r) => r.category === selected)) return prev; // already added
      return {
        ...prev,
        [type]: [...typeRows, { category: selected, value: "", target: "" }],
      };
    });
    setPickedOption((prev) => ({ ...prev, [type]: "" }));
  };

  // ── Remove a pick-and-add row ─────────────────────────────────────────────
  const removeRow = (type: string, rowIndex: number) => {
    setRows((prev) => {
      const typeRows = [...(prev[type] ?? [])];
      typeRows.splice(rowIndex, 1);
      return { ...prev, [type]: typeRows };
    });
  };

  // ── Render the table for a disaggregation type ────────────────────────────
  const renderTypeSection = (type: DisaggType) => {
    const typeRows = rows[type] ?? [];
    const isPickAndAdd = PICK_AND_ADD_TYPES.includes(type);
    const options = isPickAndAdd ? getDropdownOptions(type) : [];

    const valueSum = sumRows(typeRows, "value");
    const targetSum = sumRows(typeRows, "target");

    return (
      <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-sm font-semibold text-gray-800">{type}</span>
            {isPickAndAdd && (
              <p className="text-xs text-gray-400 mt-0.5">
                Select each {type.toLowerCase()} you want to include, then enter
                the baseline and target values for each. These should sum to your
                cumulative totals above.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {cumVal > 0 && (
              <ValidationBadge sum={valueSum} total={cumVal} label="Baseline" />
            )}
            {cumTgt > 0 && (
              <ValidationBadge sum={targetSum} total={cumTgt} label="Target" />
            )}
          </div>
        </div>

        {/* Pick-and-add row */}
        {isPickAndAdd && (
          <div className="px-4 py-3 bg-blue-50/40 border-b border-gray-200 flex items-center gap-3">
            <div className="flex-1">
              <DropDown
                name={`pick-${type}`}
                value={pickedOption[type] ?? ""}
                onChange={(v) =>
                  setPickedOption((prev) => ({ ...prev, [type]: v }))
                }
                options={options.filter(
                  (o) => !typeRows.some((r) => r.category === o.value)
                )}
                placeholder={`Select ${type}…`}
              />
            </div>
            <button
              type="button"
              onClick={() => addPickedRow(type)}
              disabled={!pickedOption[type]}
              className="shrink-0 h-10 px-4 rounded-md text-sm font-medium bg-(--primary) text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              + Add
            </button>
          </div>
        )}

        {/* Column headers */}
        {typeRows.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-gray-200">
            <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Category
            </div>
            <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Baseline Value
            </div>
            <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Target Value
            </div>
          </div>
        )}

        {/* Rows */}
        {typeRows.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4 italic">
            {isPickAndAdd
              ? `Select a ${type.toLowerCase()} from the dropdown above and click + Add to begin.`
              : "No categories."}
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {typeRows.map((row, ri) => (
              <div
                key={row.category}
                className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-gray-100 items-center"
              >
                {/* Category label */}
                <div className="bg-white px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-700 font-medium">
                    {row.category}
                  </span>
                  {isPickAndAdd && (
                    <button
                      type="button"
                      onClick={() => removeRow(type, ri)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-xs"
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Baseline value */}
                <div className="bg-white px-3 py-1.5">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={row.value}
                    onChange={(e) => updateRow(type, ri, "value", e.target.value)}
                    placeholder="0"
                    className="w-full h-9 outline-none border border-gray-300 focus:border-[--primary-light] rounded-md px-3 text-sm"
                  />
                </div>

                {/* Target value */}
                <div className="bg-white px-3 py-1.5">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={row.target}
                    onChange={(e) => updateRow(type, ri, "target", e.target.value)}
                    placeholder="0"
                    className="w-full h-9 outline-none border border-gray-300 focus:border-[--primary-light] rounded-md px-3 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sum footer */}
        {typeRows.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-gray-200 border-t border-gray-200">
            <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
              Total
            </div>
            <div
              className={`bg-gray-50 px-4 py-2 text-xs font-bold ${
                cumVal > 0 && Math.abs(cumVal - valueSum) < 0.001
                  ? "text-green-600"
                  : cumVal > 0 && valueSum > cumVal
                  ? "text-red-500"
                  : "text-gray-700"
              }`}
            >
              {valueSum.toLocaleString()}
              {cumVal > 0 && (
                <span className="text-gray-400 font-normal"> / {cumVal.toLocaleString()}</span>
              )}
            </div>
            <div
              className={`bg-gray-50 px-4 py-2 text-xs font-bold ${
                cumTgt > 0 && Math.abs(cumTgt - targetSum) < 0.001
                  ? "text-green-600"
                  : cumTgt > 0 && targetSum > cumTgt
                  ? "text-red-500"
                  : "text-gray-700"
              }`}
            >
              {targetSum.toLocaleString()}
              {cumTgt > 0 && (
                <span className="text-gray-400 font-normal"> / {cumTgt.toLocaleString()}</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h4 className="font-bold leading-7 text-base">Disaggregation</h4>

      {/* Checkbox grid */}
      <div className="grid grid-cols-2 gap-2">
        {DISAGG_TYPES.map((label, index) => (
          <Checkbox
            key={index}
            label={label}
            name={label}
            isChecked={checkboxes[index]}
            onChange={() => toggleCheckbox(index)}
          />
        ))}
      </div>

      {/* Input tables */}
      {checkedTypes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {cumVal === 0 && cumTgt === 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
              Fill in the <strong>Cumulative Value</strong> and{" "}
              <strong>Cumulative Target</strong> above so the component can validate
              that your disaggregated entries add up correctly.
            </p>
          )}
          {checkedTypes.map((type) => renderTypeSection(type))}
        </div>
      )}
    </div>
  );
}