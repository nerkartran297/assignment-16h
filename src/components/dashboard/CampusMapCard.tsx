import { ExternalLinkIcon } from "lucide-react";

export function CampusMapCard() {
  return (
    <section className="group overflow-hidden rounded-lg border border-[#F1F5F9] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
      <div className="relative h-60 bg-[radial-gradient(circle_at_20%_20%,rgba(120,180,90,0.8),transparent_20%),radial-gradient(circle_at_70%_30%,rgba(75,120,55,0.9),transparent_24%),radial-gradient(circle_at_40%_70%,rgba(110,150,75,0.85),transparent_22%),radial-gradient(circle_at_85%_75%,rgba(85,130,60,0.75),transparent_18%),linear-gradient(135deg,#263c22,#425c32,#1d2f21)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.32))] transition-opacity duration-200 group-hover:opacity-90" />
        <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
          Live Preview
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
            Campus Map View
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Spatial overview of facilities and grounds
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-1 justify-start">
          <p className="text-sm font-medium text-slate-700">Last updated:</p>
          <p className="text-sm text-slate-500">2h ago</p>
        </div>
        <button className="inline-flex min-h-[40px] items-center justify-center rounded-lg px-3.5 py-2 text-sm font-semibold text-emerald-700 transition-all duration-200  hover:bg-white hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200">
          Full Map <ExternalLinkIcon className="h-4 w-4 ml-2" />
        </button>
      </div>
    </section>
  );
}
