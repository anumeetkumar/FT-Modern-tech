"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";

interface UpdatePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (data: { current: string; newPass: string; confirm: string }) => void;
}

const UpdatePasswordDialog: React.FC<UpdatePasswordDialogProps> = ({
  open,
  onOpenChange,
  onUpdate,
}) => {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (form.newPass !== form.confirm) return alert("Passwords do not match");
    onUpdate?.(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <LockResetRoundedIcon fontSize="small" />
            Update Password
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Securely update your account password
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            type="password"
            placeholder="Current Password"
            value={form.current}
            onChange={(e) => handleChange("current", e.target.value)}
            className="border-border text-foreground bg-background"
          />
          <Input
            type="password"
            placeholder="New Password"
            value={form.newPass}
            onChange={(e) => handleChange("newPass", e.target.value)}
            className="border-border text-foreground bg-background"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) => handleChange("confirm", e.target.value)}
            className="border-border text-foreground bg-background"
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            onClick={handleSubmit}
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <LockResetRoundedIcon className="mr-2 h-4 w-4" /> Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordDialog;
