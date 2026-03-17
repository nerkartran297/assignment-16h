"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  placement?: "top" | "bottom";
  leftOffset?: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDateString(value?: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value?: string): string {
  const date = parseDateString(value);
  if (!date) return "";
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWithinRange(date: Date, min?: string, max?: string): boolean {
  const current = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  const minTime = min ? parseDateString(min)?.setHours(0, 0, 0, 0) : undefined;
  const maxTime = max ? parseDateString(max)?.setHours(0, 0, 0, 0) : undefined;

  if (minTime != null && current < minTime) return false;
  if (maxTime != null && current > maxTime) return false;
  return true;
}

function buildCalendarDays(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Array<{ date: Date; inCurrentMonth: boolean }> = [];

  for (let i = 0; i < startWeekday; i++) {
    const date = new Date(year, month, i - startWeekday + 1);
    days.push({ date, inCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date;
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    days.push({ date: next, inCurrentMonth: false });
  }

  while (days.length < 42) {
    const last = days[days.length - 1].date;
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    days.push({ date: next, inCurrentMonth: false });
  }

  return days;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  className,
  disabled = false,
  min,
  max,
  placement = "bottom",
  leftOffset = 0,
}: DatePickerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = parseDateString(value);
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(selectedDate ?? today);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const calendarDays = useMemo(() => buildCalendarDays(viewDate), [viewDate]);

  const goToPrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDate = (date: Date) => {
    if (!isWithinRange(date, min, max)) return;
    onChange(formatDateValue(date));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {label ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex min-h-[44px] w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-left text-sm transition-all duration-150",
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : "text-slate-700 hover:border-slate-300 hover:bg-slate-50/70",
          open && !disabled && "border-slate-300 bg-slate-50/70",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5 pr-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
          <span
            className={cn(
              "truncate",
              value ? "text-slate-700" : "text-slate-400",
            )}
          >
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </span>
      </button>

      {open && !disabled ? (
        <div
          className={cn(
            `absolute left-[${leftOffset}px] z-40 w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)]`,
            placement === "top"
              ? "bottom-[calc(100%+8px)]"
              : "top-[calc(100%+8px)]",
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">
                {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
              </p>
            </div>

            <button
              type="button"
              onClick={goToNextMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="flex h-9 items-center justify-center text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400"
              >
                {day}
              </div>
            ))}

            {calendarDays.map(({ date, inCurrentMonth }) => {
              const selected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);
              const disabledDate = !isWithinRange(date, min, max);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={disabledDate}
                  onClick={() => handleSelectDate(date)}
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-xl text-sm transition-colors",
                    !inCurrentMonth && "text-slate-300",
                    inCurrentMonth &&
                      !selected &&
                      !disabledDate &&
                      "text-slate-700",
                    isToday && !selected && "border border-slate-200",
                    selected &&
                      "bg-[#208D26] font-semibold text-white hover:bg-emerald-800",
                    !selected && !disabledDate && "hover:bg-slate-50",
                    disabledDate &&
                      "cursor-not-allowed text-slate-300 opacity-50",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
