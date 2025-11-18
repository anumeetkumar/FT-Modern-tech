import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "@mui/icons-material";

export default function ReminderSheet({ open, onOpenChange, selection }: any) {
  const [channels, setChannels] = useState<{
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  }>({ email: true, sms: true, whatsapp: false });
  const [message, setMessage] = useState(
    "Your device subscription is due. Please renew to avoid suspension."
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-2">
        <SheetHeader>
          <SheetTitle>Send reminder</SheetTitle>
          <SheetDescription>
            Notify per‑device or consolidated by customer.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="r_email"
              checked={channels.email}
              onCheckedChange={(c) =>
                setChannels((s) => ({ ...s, email: !!c }))
              }
            />
            <Label htmlFor="r_email">Email</Label>
            <Checkbox
              id="r_sms"
              checked={channels.sms}
              onCheckedChange={(c) => setChannels((s) => ({ ...s, sms: !!c }))}
            />
            <Label htmlFor="r_sms">SMS</Label>
            <Checkbox
              id="r_wa"
              checked={channels.whatsapp}
              onCheckedChange={(c) =>
                setChannels((s) => ({ ...s, whatsapp: !!c }))
              }
            />
            <Label htmlFor="r_wa">WhatsApp</Label>
          </div>
          <div>
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Variables: {"{customer}"}, {"{vehicle}"}, {"{imei}"},{" "}
              {"{expiry_date}"}, {"{amount}"}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gap-2">
            <Send sx={{ fontSize: 16 }} /> Send
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}