import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { copy, fmtMoney, formatDate } from "@/lib/data/admin";
import { Txn } from "@/lib/types/admin";

const TransactionDetailModal = ({
  open,
  setOpen,
  active,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  active: Txn | null;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="typo-h3">
            Transaction
          </DialogTitle>
          <DialogDescription className="typo-p-muted">
            Gateway payment information
          </DialogDescription>
        </DialogHeader>

        {active && (
          <div className="space-y-3">
            {/* Top Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard label="Transaction ID" value={active.id} mono />
              <InfoCard label="Date" value={formatDate(active.date)} />
              <InfoCard label="Status" value={active.status} capitalize />
              <InfoCard label="Method" value={active.method} />
            </div>

            {/* Amount Section */}
            <Card className="border-border bg-background shadow-sm">
              <CardHeader className="pb-1">
                <CardTitle className="typo-p500">
                  Amount & Credits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 typo-p">
                <Row
                  label="Amount"
                  value={fmtMoney(active.amount, active.currency)}
                />
                {typeof active.fee === "number" && (
                  <Row
                    label="Gateway fee"
                    value={fmtMoney(active.fee, active.currency)}
                  />
                )}
                {typeof active.tax === "number" && (
                  <Row
                    label="Tax"
                    value={fmtMoney(active.tax, active.currency)}
                  />
                )}
                <Separator />
                <Row
                  label="Credits"
                  value={`${active.credits > 0 ? "+" : ""}${active.credits}`}
                  valueClass={
                    active.credits < 0
                      ? "text-error"
                      : "text-success font-medium"
                  }
                />
              </CardContent>
            </Card>

            {/* Gateway Section */}
            <Card className="border-border bg-background shadow-sm">
              <CardHeader className="pb-1">
                <CardTitle className="typo-p500">
                  Gateway
                </CardTitle>
              </CardHeader>
              <CardContent className="typo-p space-y-1">
                <TextRow label="Reference" value={active.reference} mono />
                <TextRow label="Invoice" value={active.invoiceNo} />
                <TextRow label="Notes" value={active.notes} />

                {active.meta && Object.keys(active.meta).length > 0 && (
                  <div className="pt-2 space-y-1">
                    <div className="typo-subtitle">Metadata</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(active.meta).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-center justify-between rounded border border-border px-2 py-1 typo-p12n"
                        >
                          <span className="text-muted">{k}</span>
                          <span className="font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => window.open(active.receiptUrl || "#", "_blank")}
                size="sm"
              >
                Receipt
              </Button>
              <Button
                variant="outline"
                onClick={() => copy(active.reference || active.id)}
                size="sm"
              >
                Copy reference
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;

const InfoCard = ({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string;
  value: any;
  mono?: boolean;
  capitalize?: boolean;
}) => (
  <Card className="border-border bg-background shadow-sm">
    <CardContent className="px-3">
      <div className="typo-subtitle">{label}</div>
      <div
        className={`mt-1 typo-p ${mono ? "font-mono" : "font-medium"} ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "—"}
      </div>
    </CardContent>
  </Card>
);

const Row = ({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: any;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-muted">{label}</span>
    <span className={valueClass || "font-medium"}>{value}</span>
  </div>
);

const TextRow = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: any;
  mono?: boolean;
}) => (
  <div className="flex gap-2 typo-p">
    <span className="text-muted shrink-0">{label}:</span>
    <span className={mono ? "font-mono" : ""}>{value || "—"}</span>
  </div>
);
