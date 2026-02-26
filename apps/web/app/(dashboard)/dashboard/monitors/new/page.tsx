import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@trackrel/ui";
import { MonitorForm } from "../components/monitor-form";
import { ROUTES } from "@/lib/routes";

export default function NewMonitorPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.dashboard.monitors.list}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to monitors</span>
          </Link>
        </Button>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">New Monitor</h2>
          <p className="text-muted-foreground">
            Create a new monitor to track changes on a website.
          </p>
        </div>
      </div>

      <MonitorForm />
    </div>
  );
}
