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


export type Method = "Online" | "UPI" | "Cash" | "Bank" | "Cheque" | "Card";
export type Status = "Settled" | "Pending" | "Refunded";

export type Payment = {
  id: string;
  date: string; // ISO
  customer: string;
  vehicle: string; // e.g., MH12AB1234
  imei: string;
  plan: string;
  channel: "Online" | "Manual";
  method: Method;
  amount: number; // base amount (without tax)
  tax: number; // GST etc
  total: number; // amount + tax
  status: Status;
  reference: string; // txn id, cheque no, etc
  invoiceNo: string;
};