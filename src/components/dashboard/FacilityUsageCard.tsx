import type { FacilityUsage } from "@/features/bookings/booking.types";
import { TrendingUpIcon } from "lucide-react";

export interface FacilityUsageCardProps {
  usage: FacilityUsage[];
}

export function FacilityUsageCard({ usage }: FacilityUsageCardProps) {
  return (
    <section className="rounded-lg border border-[#F1F5F9] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
      <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#0F172A]">
        Facility Usage
      </h2>

      <div className="mt-6 space-y-4">
        {usage.map((facility) => (
          <div key={facility.name} className="rounded-lg">
            <div className="mb-2.5 flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2.5">
                {/* <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /> */}
                <span className="truncate font-medium text-md text-[#475569]">
                  {facility.name}
                </span>
              </div>
              <span className="font-semibold text-[#0F172A]">
                {facility.usage}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200/80">
              <div
                className="h-2.5 rounded-full bg-linear-to-r from-emerald-600 to-[#208D26]"
                style={{ width: `${facility.usage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {usage.length > 0 && (
        <div className="mt-6 border-t border-[#F1F5F9] pt-6">
          <div className="rounded-lg bg-[#F8FAFC] p-4">
            <p className="text-sm font-regular text-[#64748B]">
              Most Popular
            </p>
            <p className="mt-2 text-md font-semibold text-[#0F172A] flex items-center">
              <TrendingUpIcon className="h-6 w-6 mr-2 text-[#208D26]" />
              {usage[0].name}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
