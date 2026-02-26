"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@trackrel/ui";
import { DeleteMonitorDialog } from "../../components/delete-monitor-dialog";
import { ROUTES } from "@/lib/routes";

interface MonitorActionsProps {
  monitorId: string;
  monitorName: string;
}

export function MonitorActions({ monitorId, monitorName }: MonitorActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.dashboard.monitors.edit(monitorId)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <DeleteMonitorDialog
        monitorId={monitorId}
        monitorName={monitorName}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
