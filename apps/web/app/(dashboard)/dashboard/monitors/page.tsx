import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@trackrel/ui";
import { getMonitors } from "@/lib/actions/monitors";
import { MonitorsTable } from "./components/monitors-table";
import { ROUTES } from "@/lib/routes";

export default async function MonitorsPage() {
  const result = await getMonitors();
  const monitors = result.success ? result.data : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Monitors</h2>
          <p className="text-muted-foreground">
            Manage your website change detection monitors.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.dashboard.monitors.new}>
            <Plus className="mr-2 h-4 w-4" />
            New Monitor
          </Link>
        </Button>
      </div>

      <MonitorsTable monitors={monitors} />
    </div>
  );
}
