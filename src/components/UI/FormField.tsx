export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    // border border-slate-200 bg-white p-4
    <div className="rounded-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
