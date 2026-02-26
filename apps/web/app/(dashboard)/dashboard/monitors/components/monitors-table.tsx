"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Radio, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@trackrel/ui";
import type { SelectMonitor } from "@trackrel/db";
import { DeleteMonitorDialog } from "./delete-monitor-dialog";
import { ROUTES } from "@/lib/routes";

interface MonitorsTableProps {
  monitors: SelectMonitor[];
}

export function MonitorsTable({ monitors }: MonitorsTableProps) {
  const [monitorToDelete, setMonitorToDelete] = useState<SelectMonitor | null>(null);

  if (monitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Radio className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No monitors created</h2>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            You don&apos;t have any monitors yet. Create one to start tracking changes on websites.
          </p>
          <Button asChild>
            <Link href={ROUTES.dashboard.monitors.new}>
              <Plus className="mr-2 h-4 w-4" />
              Create Monitor
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Last Check</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monitors.map((monitor) => (
              <TableRow key={monitor.id}>
                <TableCell className="font-medium">
                  <Link href={ROUTES.dashboard.monitors.detail(monitor.id)} className="hover:underline">
                    {monitor.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      monitor.status === "active"
                        ? "default"
                        : monitor.status === "failing"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {monitor.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  <a href={monitor.url} target="_blank" rel="noreferrer" className="hover:underline">
                    {monitor.url}
                  </a>
                </TableCell>
                <TableCell>Every {monitor.frequencyMinutes}m</TableCell>
                <TableCell className="text-muted-foreground">
                  {monitor.lastCheckAt ? (
                    <span title={new Date(monitor.lastCheckAt).toLocaleString()}>
                      {getRelativeTime(new Date(monitor.lastCheckAt))}
                    </span>
                  ) : (
                    "Never"
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.dashboard.monitors.edit(monitor.id)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => setMonitorToDelete(monitor)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteMonitorDialog
        monitorId={monitorToDelete?.id || ""}
        monitorName={monitorToDelete?.name || ""}
        open={!!monitorToDelete}
        onOpenChange={(open) => {
          if (!open) setMonitorToDelete(null);
        }}
      />
    </>
  );
}

function getRelativeTime(date: Date) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60));
  const minutesDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60));

  if (Math.abs(daysDifference) > 0) {
    return rtf.format(daysDifference, "day");
  } else if (Math.abs(hoursDifference) > 0) {
    return rtf.format(hoursDifference, "hour");
  } else if (Math.abs(minutesDifference) > 0) {
    return rtf.format(minutesDifference, "minute");
  } else {
    return "Just now";
  }
}
