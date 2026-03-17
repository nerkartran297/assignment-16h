export type ReportStatus =
  | "pending"      // Đang chờ
  | "received"     // Đã tiếp nhận
  | "in_progress"  // Đang khắc phục
  | "resolved";   // Đã khắc phục

export interface Report {
  id: string;
  date: string;
  facilityName: string;
  description: string;
  status: ReportStatus;
  createdAt?: string;
}
