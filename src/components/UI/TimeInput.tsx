"use client";

import { cn } from "@/lib/cn";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";

export interface TimeInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function splitTime(value: string): { timePart: string; period: "AM" | "PM" } {
  const trimmed = (value || "").trim();
  if (!trimmed) return { timePart: "", period: "AM" };
  const match = /^(.+?)\s+(AM|PM)$/i.exec(trimmed);
  if (match) {
    return {
      timePart: match[1],
      period: match[2].toUpperCase() as "AM" | "PM",
    };
  }
  return { timePart: trimmed, period: "AM" };
}

export function TimeInput({
  value = "",
  onChange,
  placeholder = "hh:mm",
  className,
  disabled = false,
}: TimeInputProps) {
  const { timePart, period } = splitTime(value);

  const commit = (nextTime: string, nextPeriod: "AM" | "PM") => {
    const clean = nextTime.trim();
    if (!clean) {
      onChange("");
    } else {
      onChange(`${clean} ${nextPeriod}`);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    commit(next, period);
  };

  const handlePeriodChange = (next: string) => {
    const nextPeriod = next === "PM" ? "PM" : "AM";
    commit(timePart, nextPeriod);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="text"
        value={timePart}
        onChange={handleTimeChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border h-11 border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
        aria-label="Time"
      />
      <FilterDropdown
        value={period}
        onChange={handlePeriodChange}
        options={[
          { label: "AM", value: "AM" },
          { label: "PM", value: "PM" },
        ]}
        placeholder="AM/PM"
        searchable={false}
        className="min-w-[90px] shrink-0"
      />
    </div>
  );
}
