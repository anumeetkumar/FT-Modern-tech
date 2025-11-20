import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import StatusChip from "@/components/admin/billing/StatusChip";
import {
  Search,
  CreditCard,
  Schedule as Clock3,
  NotificationsActive as BellRing,
  Block as ShieldOff,
  People as Users,
  PhoneAndroid as MonitorSmartphone,
} from "@mui/icons-material";
import { PLANS } from "@/lib/data/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BillingControlsProps {
  view: "customers" | "devices";
  setView: (v: "customers" | "devices") => void;
  query: string;
  setQuery: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  planFilter: string;
  setPlanFilter: (v: string) => void;
  channelFilter: string;
  setChannelFilter: (v: string) => void;
  onlyAutoRenew: boolean;
  setOnlyAutoRenew: (v: boolean) => void;
  selected: string[];
  counts: {
    all: number;
    active: number;
    expiring: number;
    overdue: number;
    suspended: number;
  };
  setSelected: (v: string[]) => void;
  setExpanded: (v: Record<string, boolean>) => void;
  groups: Record<string, string[]>;
  setExtendOpen: (v: boolean) => void;
  setRenewOpen: (v: boolean) => void;
  setSuspendOpen: (v: boolean) => void;
  setReminderOpen: (v: boolean) => void;
}

const BillingControls: React.FC<BillingControlsProps> = ({
  view,
  setView,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  channelFilter,
  setChannelFilter,
  onlyAutoRenew,
  setOnlyAutoRenew,
  selected,
  counts,
  setSelected,
  setExpanded,
  groups,
  setExtendOpen,
  setRenewOpen,
  setSuspendOpen,
  setReminderOpen,
}) => {
  const clearSelection = () => setSelected([]);

  // Expand helpers
  const expandAll = () => {
    const next: Record<string, boolean> = {};
    Object.keys(groups).forEach((g) => (next[g] = true));
    setExpanded(next);
  };
  const collapseAll = () => setExpanded({});

  function Segmented({
    value,
    onChange,
  }: {
    value: "customers" | "devices";
    onChange: (v: any) => void;
  }) {
    return (
      <div className="inline-flex rounded-xl border p-1 ">
        <button
          onClick={() => onChange("customers")}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
            value === "customers" ? "bg-primary text-white" : ""
          }`}
        >
          <Users sx={{ fontSize: 16 }} /> Customers
        </button>
        <button
          onClick={() => onChange("devices")}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
            value === "devices" ? "bg-primary text-white" : ""
          }`}
        >
          <MonitorSmartphone sx={{ fontSize: 16 }} /> Devices
        </button>
      </div>
    );
  }

  return (
    <>
      {" "}
      <div className="flex flex-wrap items-center gap-2">
        <Segmented value={view} onChange={setView} />
        <div className="relative flex-1 min-w-[240px]">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer, device, IMEI, plan…"
            className="pl-9 mt-0"
          />
          <Search
            sx={{ fontSize: 16 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            {PLANS.filter((p) => p.id !== "custom").map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
          <Toggle checked={onlyAutoRenew} onChange={setOnlyAutoRenew} />
          <Label htmlFor="autoRenew" className="text-sm">
            Auto‑renew only
          </Label>
        </div>
        {view === "customers" ? (
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={expandAll}>
              Expand all
            </Button>
            <Button variant="outline" onClick={collapseAll}>
              Collapse all
            </Button>
          </div>
        ) : null}
      </div>
      {/* Status chips */}
      <div className="flex flex-wrap gap-2 mt-4">
        <StatusChip
          label={`All (${counts.all})`}
          onClick={() => setStatusFilter("all")}
          active={statusFilter === "all"}
        />
        <StatusChip
          label={`Active (${counts.active})`}
          onClick={() => setStatusFilter("active")}
          active={statusFilter === "active"}
        />
        <StatusChip
          label={`Expiring (${counts.expiring})`}
          onClick={() => setStatusFilter("expiring")}
          active={statusFilter === "expiring"}
          tone="amber"
        />
        <StatusChip
          label={`Overdue (${counts.overdue})`}
          onClick={() => setStatusFilter("overdue")}
          active={statusFilter === "overdue"}
          tone="rose"
        />
        <StatusChip
          label={`Suspended (${counts.suspended})`}
          onClick={() => setStatusFilter("suspended")}
          active={statusFilter === "suspended"}
          tone="zinc"
        />
      </div>
      {/* Bulk toolbar */}
      {selected.length > 0 && (
        <Card className="mt-4 border-zinc-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="typo-p-muted">
              <span className="font-medium text-zinc-900">
                {selected.length}
              </span>{" "}
              device(s) selected
            </div>
            <div className="flex items-center gap-2">
              <Button className="gap-2" onClick={() => setRenewOpen(true)}>
                <CreditCard sx={{ fontSize: 16 }} /> Renew
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setExtendOpen(true)}
              >
                <Clock3 sx={{ fontSize: 16 }} /> Extend
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setSuspendOpen(true)}
              >
                <ShieldOff sx={{ fontSize: 16 }} /> Suspend
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setReminderOpen(true)}
              >
                <BellRing sx={{ fontSize: 16 }} /> Reminder
              </Button>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <Button
                variant="ghost"
                onClick={clearSelection}
                className="text-zinc-600"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default BillingControls;
