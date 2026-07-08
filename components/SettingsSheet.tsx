"use client";

import { useState } from "react";
import { toast } from "sonner";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { subscribeToPush } from "@/lib/push-client";

export function SettingsSheet() {
  const [open, setOpen] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  async function handleEnableReminders() {
    setPushLoading(true);
    const result = await subscribeToPush();
    setPushLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Reminders enabled");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleEnableReminders}
            disabled={pushLoading}
          >
            {pushLoading ? "Enabling..." : "Enable reminders"}
          </Button>
          <form action={signOut}>
            <Button variant="ghost" className="w-full" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
