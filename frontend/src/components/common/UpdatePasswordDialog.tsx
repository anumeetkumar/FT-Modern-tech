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
  onUpdate?: (data: { newPass: string }) => void;
}

const UpdatePasswordDialog: React.FC<UpdatePasswordDialogProps> = ({
  open,
  onOpenChange,
  onUpdate,
}) => {
  const [newPass, setNewPass] = useState("");

  const handleSubmit = () => {
    onUpdate?.({ newPass });
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
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="border-border text-foreground bg-background"
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button onClick={handleSubmit}>
            <LockResetRoundedIcon className="mr-2 h-4 w-4" /> Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordDialog;
