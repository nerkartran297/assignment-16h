"use client";

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      {/* Stat cards row */}
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-6 w-12 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
            <div className="mt-1 h-9 w-20 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Main content: table + sidebar */}
      <div className="mt-6 grid gap-5 2xl:grid-cols-[minmax(0,1.55fr)_340px]">
        {/* Recent bookings table skeleton */}
        <div className="flex flex-1 flex-col space-y-6">
          <div className="rounded-lg border border-[#F1F5F9] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
              <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
              <div className="flex gap-3">
                <div className="h-[42px] w-[120px] animate-pulse rounded-lg bg-slate-100" />
                <div className="h-[42px] w-[140px] animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-100">
              <div className="bg-slate-50/80 px-4 py-3">
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-3 w-20 animate-pulse rounded bg-slate-200"
                    />
                  ))}
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6].map((row) => (
                  <div
                    key={row}
                    className="flex items-center gap-4 px-4 py-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                    </div>
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-4">
              <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
              <div className="flex gap-2">
                <div className="h-[38px] w-16 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
                <div className="h-[38px] w-14 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Facility Usage + Campus Map */}
        <div className="space-y-6">
          <div className="rounded-lg border border-[#F1F5F9] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
            <div className="mt-1.5 h-6 w-36 animate-pulse rounded bg-slate-200" />
            <div className="mt-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-8 animate-pulse rounded bg-slate-100" />
                  </div>
                  <div className="h-2.5 w-full animate-pulse rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-[#F1F5F9] pt-6">
              <div className="rounded-lg bg-[#F8FAFC] p-4">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-5 w-32 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#F1F5F9] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
            <div className="h-60 animate-pulse bg-slate-200" />
            <div className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
              <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
