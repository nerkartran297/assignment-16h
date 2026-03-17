"use client";

export interface SectionTableSkeletonProps {
  /** Section title shown in header */
  title?: string;
  /** Number of skeleton rows in the table body */
  rowCount?: number;
  /** Number of columns (for consistent width) */
  columnCount?: number;
  /** Optional: show search + filter placeholders in header */
  showHeaderBar?: boolean;
  /** Optional: custom className for the section wrapper */
  className?: string;
}

export function SectionTableSkeleton({
  title = "Loading…",
  rowCount = 8,
  columnCount = 5,
  showHeaderBar = true,
  className = "",
}: SectionTableSkeletonProps) {
  return (
    <section
      className={`flex min-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-[8px] border border-[#F1F5F9] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)] ${className}`}
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="border-b border-slate-200/80 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            {title}
          </h2>
          {showHeaderBar ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-[42px] w-full min-w-[180px] max-w-[220px] animate-pulse rounded-lg bg-slate-100" />
              <div className="h-[42px] w-[140px] animate-pulse rounded-lg bg-slate-100" />
              <div className="h-[42px] w-[120px] animate-pulse rounded-lg bg-slate-100" />
              <div className="h-[42px] w-[120px] animate-pulse rounded-lg bg-slate-100" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full table-fixed text-left">
          <thead className="bg-slate-50/80">
            <tr>
              {Array.from({ length: columnCount }).map((_, i) => (
                <th
                  key={i}
                  className="px-5 py-3.5 md:px-6"
                >
                  <div
                    className="h-3 w-20 animate-pulse rounded bg-slate-200"
                    style={{ width: i === 0 ? 80 : 60 }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-slate-100"
              >
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td key={colIndex} className="px-5 py-4 md:px-6">
                    {colIndex === 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="h-4 animate-pulse rounded bg-slate-100"
                        style={{
                          width:
                            colIndex === 1 ? 72 : colIndex === columnCount - 1 ? 64 : 100,
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200/80 bg-white px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
          <div className="flex items-center gap-2">
            <div className="h-[38px] w-16 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-[38px] w-14 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    </section>
  );
}
