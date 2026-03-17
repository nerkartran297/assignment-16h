import type { ReportStatus } from "./report.types";

export function formatReportStatusLabel(status: ReportStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "received":
      return "Received";
    case "in_progress":
      return "In progress";
    case "resolved":
      return "Resolved";
    default:
      return status;
  }
}

export function getNextReportId(reports: { id: string }[]): string {
  const numbers = reports
    .map((r) => {
      const match = /^RPT-(\d+)$/i.exec(r.id);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `RPT-${next.toString().padStart(3, "0")}`;
}
