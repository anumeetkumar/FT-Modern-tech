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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditSuperAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    name: string;
    email: string;
    mobilePrefix: string;
    mobileNumber: string;
    address: string;
    company: string;
  };
  onSave: (updated: any) => void;
}

const EditSuperAdminDialog: React.FC<EditSuperAdminDialogProps> = ({
  open,
  onOpenChange,
  data,
  onSave,
}) => {
  const [form, setForm] = useState(data);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update Super Admin details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border-border text-foreground bg-background"
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border-border text-foreground bg-background"
          />
          <div className="flex gap-2">
            <Input
              placeholder="Prefix"
              value={form.mobilePrefix}
              onChange={(e) => handleChange("mobilePrefix", e.target.value)}
              className="border-border text-foreground bg-background w-24"
            />
            <Input
              placeholder="Mobile Number"
              value={form.mobileNumber}
              onChange={(e) => handleChange("mobileNumber", e.target.value)}
              className="border-border text-foreground bg-background flex-1"
            />
          </div>
          <Textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="border-border text-foreground bg-background"
          />
          <Input
            placeholder="Company"
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="border-border text-foreground bg-background"
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSuperAdminDialog;
