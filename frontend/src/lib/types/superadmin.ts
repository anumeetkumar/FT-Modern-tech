export type Company = { name: string };

export type AdminRow = {
  id: string;
  name: string;
  mobilePrefix: string;
  mobileNumber: string;
  email?: string;
  username: string;
  isEmailVerified: boolean;
  profileUrl?: string;
  vehicles?: number;
  credits: number;
  isActive: boolean;
  address: string;
  city: string;
  country: string;
  countryCode: string;
  createdAt: string; // "YYYY-MM-DD hh:mm AM/PM"
  lastLogin: string; // "" when unknown
  companies?: Company[];
};


export type FileKind = "pdf" | "image" | "doc" | "other"; // actual file type

export const DOC_TYPE_OPTIONS = [
  "PAN Card",
  "Employment Contract",
  "NDA / Confidentiality Agreement",
  "Driver License",
  "Insurance Policy",
  "Company Registration",
  "Bank Statement",
  "Address Proof",
  "Other",
] as const;

export type DocumentItem = {
  id: string;
  name: string;
  fileKind: FileKind;
  size: number; // in bytes
  uploadedAt: Date;
  expiry?: Date | null;
  tags: string[];
  status: "valid" | "expiring" | "expired";
  version: number;
  url?: string; // Object URL for uploaded files (client-only)
  docType: typeof DOC_TYPE_OPTIONS[number]; // Business doc type
};