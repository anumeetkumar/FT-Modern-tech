export interface SimCard {
  id: string;
  simno: string;
  imsi?: string;
  provider: string;
  iccid?: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  name: string;
}

export interface AddSimCardFormData {
  simno: string;
  imsi?: string;
  provider: string;
  iccid?: string;
}

export interface BulkUploadSimCardData {
  simno: string;
  imsi?: string;
  provider: string;
  iccid?: string;
}

export interface SimCardRow {
  SimNo: string;
  IMSI?: string;
  Provider: string;
  ICCID?: string;
  Status: "active" | "inactive" | "suspended";
  CreatedAt: string;
}