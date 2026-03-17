export type FacilityType = "hut" | "deck" | "trail" | "bath" | "pod";

export type FacilityStatus = "active" | "inactive";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  capacity: number;
  status: FacilityStatus;
  location: string;
}

