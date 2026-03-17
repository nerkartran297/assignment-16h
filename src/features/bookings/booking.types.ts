export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export type FacilityType = "trail" | "deck" | "hut" | "bath" | "pod";

export interface Booking {
  id: string;
  facilityName: string;
  facilityType: FacilityType;
  employeeName: string;
  companyName: string;
  date: string;
  time: string;
  status: BookingStatus;
  attendees: number;
  purpose: string;
}

export interface FacilityUsage {
  name: string;
  usage: number;
}

