export const PLANS = [
  { id: "annual-basic", name: "Annual Basic", tenureMonths: 12, price: 1499 },
  { id: "annual-pro", name: "Annual Pro", tenureMonths: 12, price: 2499 },
  {
    id: "halfyear-basic",
    name: "Half‑Year Basic",
    tenureMonths: 6,
    price: 899,
  },
  { id: "quarterly", name: "Quarterly", tenureMonths: 3, price: 499 },
  { id: "custom", name: "Custom", tenureMonths: 0, price: 0 },
];

export function genId(prefix: string = "PAY"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export const CUSTOMERS = [
  "Sharma Logistics",
  "Vijay Transports",
  "RapidMove Co.",
  "NorthStar Fleet",
  "Kiran Carriers",
];
export const VEHICLES = [
  "MH12AB1234",
  "GJ06CD4567",
  "DL01EF9876",
  "UP14GH2222",
  "KA05JK7654",
];

export const PaymentVEHICLES = [
  { vehicle: "MH12AB1234", imei: "863482040279901" },
  { vehicle: "GJ06CD4567", imei: "863482040279902" },
  { vehicle: "DL01EF9876", imei: "863482040279903" },
  { vehicle: "UP14GH2222", imei: "863482040279904" },
  { vehicle: "KA05JK7654", imei: "863482040279905" },
];

export const STATUSES = {
  ACTIVE: { label: "Active", tone: "success" },
  EXPIRING: { label: "Expiring Soon", tone: "warning" },
  OVERDUE: { label: "Overdue", tone: "danger" },
  SUSPENDED: { label: "Suspended", tone: "muted" },
};

export function daysBetween(a: Date, b: Date) {
  return Math.ceil((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);
}

export const DEVICES = Array.from({ length: 36 }).map((_, i) => {
  const base = new Date();
  const install = new Date(base);
  install.setMonth(base.getMonth() - (i % 16) - 1); // installation earlier
  const plan = PLANS[i % (PLANS.length - 1)]; // avoid custom by default
  const start = addMonths(install, 0);
  const expiry = plan.tenureMonths
    ? addMonths(start, plan.tenureMonths)
    : addMonths(start, 12);
  const daysLeft = daysBetween(expiry, new Date());
  const status =
    daysLeft < 0 ? "OVERDUE" : daysLeft <= 30 ? "EXPIRING" : "ACTIVE";
  const suspended = i % 17 === 0;
  return {
    id: `DEV-${1000 + i}`,
    customer: CUSTOMERS[i % CUSTOMERS.length],
    vehicle: VEHICLES[i % VEHICLES.length],
    imei: `86348204027${900 + i}`,
    planId: plan.id,
    planName: plan.name,
    price: plan.price,
    installAt: install.toISOString(),
    startAt: start.toISOString(),
    expiryAt: expiry.toISOString(),
    daysLeft,
    status: suspended ? "SUSPENDED" : (status as keyof typeof STATUSES),
    channel: ["Online", "Manual"][i % 2],
    autoRenew: i % 4 === 0,
  };
});
