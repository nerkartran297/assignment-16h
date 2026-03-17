"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  /** When false, the search bar is hidden. Default true. */
  searchable?: boolean;
}

export function FilterDropdown({
  value,
  onChange,
  options,
  icon,
  placeholder,
  className,
  searchable = true,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  return (
    <div ref={rootRef} className={cn("relative min-w-[190px]", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex min-h-[44px] w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-left text-sm text-slate-700 transition-all duration-150",
          "hover:border-slate-300 hover:bg-slate-50/70",
          open &&
            "border-slate-300 bg-slate-50/70 shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5 pr-3">
          {icon ? (
            <span className="shrink-0 text-slate-400">{icon}</span>
          ) : null}
          <span className="truncate font-medium text-slate-700">
            {selectedOption?.label ?? placeholder ?? "Select"}
          </span>
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <div className="rounded-xl bg-white">
            {searchable ? (
              <div className="border-b border-slate-100 p-2">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 transition-colors focus-within:border-slate-300 focus-within:bg-white">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            ) : null}

            <div
              className={cn(
                "max-h-[200px] overflow-y-auto p-1",
                "[&::-webkit-scrollbar]:w-2",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "[&::-webkit-scrollbar-thumb]:bg-slate-200",
                "hover:[&::-webkit-scrollbar-thumb]:bg-slate-300",
              )}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setQuery("");
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150",
                        isSelected
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <span className="truncate">{option.label}</span>

                      {isSelected ? (
                        <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-6 text-center text-sm text-slate-500">
                  No matches found.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
