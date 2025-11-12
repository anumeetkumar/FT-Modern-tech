export interface Device {
  id: string;
  imei: string;
  deviceType: DeviceType;
  sim?: SIM | null;
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  updatedAt: string;
}

export interface DeviceType {
  id: string;
  name: string;
  manufacturer?: string;
  model?: string;
}

export interface SIM {
  id: string;
  number: string;
  provider: string;
  imsi?: string;
  iccid?: string;
  status: "active" | "inactive" | "suspended";
}

export interface AddDeviceFormData {
  imei: string;
  deviceTypeId: string;
  simId?: string;
}

export interface BulkUploadDeviceData {
  imei: string;
  deviceType: string;
  sim?: string;
  imsi?: string;
  iccid?: string;
  simProvider?: string;
}

export interface DeviceRow {
  IMEI: string;
  DeviceType: string;
  SIM?: string;
  SIMProvider?: string;
  Status: "active" | "inactive" | "maintenance";
  CreatedAt: string;
}