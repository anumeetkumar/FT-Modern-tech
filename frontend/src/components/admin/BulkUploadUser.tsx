import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useMemo, useState } from "react";
import {
  Person as PersonIcon,

  FileUpload as FileUploadIcon,
} from "@mui/icons-material";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BulkUploadWizard from "../common/BulkUploadWizard";
import { DialogTrigger } from "@radix-ui/react-dialog";

const ROLES = [
  "Admin",
  "User",
  "Sub-User",
  "Driver",
  "Manager",
  "Team",
] as const;

type UserRow = {
  Name: string;
  username: string;
  profile_url?: string | null;
  CompanyName?: string | null;
  Mobile_prefix?: string | null; // "+91"
  Mobile?: string | null;
  Email?: string | null;
  isEmail_verified: boolean;
  Vehicles: number;
  status: "active" | "pending" | "suspended" | "inactive";
  created_at: string; // ISO
  // Optional, mostly hidden
  role?: string | null;
  Country?: string | null;
  State?: string | null;
  City?: string | null;
  Address?: string | null;
  pincode?: string | null;
};

const SAMPLE: UserRow[] = Array.from({ length: 28 }).map((_, i) => ({
  Name: [
    "Aarav Sharma",
    "Priya Singh",
    "Rohan Gupta",
    "Isha Verma",
    "Arjun Mehta",
  ][i % 5],
  username: ["aarav", "priya", "rohan", "isha", "arjun"][i % 5] + i,
  profile_url: i % 4 === 0 ? `https://picsum.photos/seed/u${i}/96` : null,
  CompanyName: [
    "Quantum Logistics",
    "SkyFleet",
    "RoadStar",
    "UrbanMove",
    "Vector Wheels",
  ][i % 5],
  Mobile_prefix: "+91",
  Mobile: `98${(1_000_000 + i * 137) % 9_999_999}`,
  Email: `user${i}@fleetstack.dev`,
  isEmail_verified: i % 2 === 0,
  Vehicles: (i * 9) % 160,
  status: (["active", "pending", "suspended", "inactive"] as const)[i % 4],
  created_at: new Date(Date.now() - i * 86400000 * 1.7).toISOString(),
  role: i % 3 === 0 ? "Admin" : "User",
  Country: "India",
  State: ["Delhi", "Maharashtra", "Karnataka", "Gujarat"][i % 4],
  City: "New Delhi",
  Address: "—",
  pincode: "110001",
}));

const BulkUploadUser = ({ rows }: { rows?: UserRow[] }) => {
  const initialRows = useMemo(() => (rows?.length ? rows : SAMPLE), [rows]);

  const [data, setData] = useState<UserRow[]>(initialRows);
  const [openImport, setOpenImport] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(ROLES[1]);

  const requiredUserColumns = [
    "Name",
    "username",
    "password",
    "email",
    "mobilePrefix",
    "mobileNumber",
  ] as const;

  const userParser = (csv: string): Record<string, string>[] => {
    const lines = csv.split("\n").filter(Boolean);
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const parsedData: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      parsedData.push(row);
    }
    return parsedData;
  };

  const userValidator = (row: Record<string, string>) => {
    const errors: string[] = [];
    requiredUserColumns.forEach((col) => {
      if (!row[col]) {
        errors.push(`${col} is required.`);
      }
    });
    return { isValid: errors.length === 0, errors };
  };

  const mapToUserRow = (row: Record<string, string>): UserRow => {
    const now = new Date().toISOString();
    return {
      Name: row.Name,
      username: row.username,
      profile_url: null,
      CompanyName: null,
      Mobile_prefix: row.mobilePrefix || null,
      Mobile: row.mobileNumber || null,
      Email: row.email || null,
      isEmail_verified: false,
      Vehicles: 0,
      status: "active",
      created_at: now,
      role: selectedRole,
      Country: null,
      State: null,
      City: null,
      Address: null,
      pincode: null,
    };
  };

  const sampleUserGenerator = () => {
    return [
      requiredUserColumns.join(","),
      "John Doe,john.doe,password123,john.doe@company.com,+91,9876543210",
      "Jane Smith,jane.smith,password456,jane.smith@company.com,+91,9876543211",
      "Mike Johnson,mike.johnson,password789,mike.johnson@company.com,+1,5551234567",
    ];
  };

  return (
    <div className="">
      <Dialog open={openImport} onOpenChange={setOpenImport}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FileUploadIcon fontSize="small" />
            Bulk Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl lg:max-w-6xl bg-background border-border flex flex-col h-[90vh]">
          <BulkUploadWizard<UserRow>
            isOpen={openImport}
            onOpenChange={setOpenImport}
            title="Bulk Upload Users"
            description="Import multiple users at once using a CSV file."
            configStepContent={
              <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <PersonIcon className="text-primary" />
                  User Role
                </Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="bg-background border-border focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  All imported users will be assigned this role.
                </p>
              </div>
            }
            sampleFileName="sample_users_import.csv"
            sampleDataGenerator={sampleUserGenerator}
            requiredColumns={requiredUserColumns}
            parser={userParser}
            validator={userValidator}
            mapToCommitData={mapToUserRow}
            onCommit={(users) => {
              setData((prev) => [...users, ...prev]);
            }}
            onCancel={() => setOpenImport(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkUploadUser;
