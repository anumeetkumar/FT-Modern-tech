export interface BillingDeviceRow {
  id: string;
  customer: string;
  vehicle: string;
  imei: string;
  planId: string;
  planName: string;
  price: number;
  expiryAt: string;
  daysLeft: number;
  status: string;
  autoRenew: boolean;
}
