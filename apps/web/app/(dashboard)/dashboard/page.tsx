import Link from "next/link";
import { Activity, AlertTriangle, Pause, Radio, Plus, ArrowRight } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@trackrel/ui";
import { getDashboardStats, getMonitors } from "@/lib/actions/monitors";
import { StatCard } from "./components/stat-card";
import { ROUTES } from "@/lib/routes";

export default async function DashboardPage() {
  const [statsResult, monitorsResult] = await Promise.all([
    getDashboardStats(),
    getMonitors(),
  ]);

  const stats = statsResult.success
    ? statsResult.data
    : { totalMonitors: 0, activeMonitors: 0, pausedMonitors: 0, failingMonitors: 0 };

  const recentMonitors = monitorsResult.success
    ? monitorsResult.data.slice(0, 5)
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your monitors today.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.dashboard.monitors.new}>
            <Plus className="mr-2 h-4 w-4" />
            New Monitor
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Monitors"
          value={stats.totalMonitors}
          icon={Radio}
        />
        <StatCard
          title="Active"
          value={stats.activeMonitors}
          icon={Activity}
        />
        <StatCard
          title="Paused"
          value={stats.pausedMonitors}
          icon={Pause}
        />
        <StatCard
          title="Failing"
          value={stats.failingMonitors}
          icon={AlertTriangle}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="grid gap-2">
            <CardTitle>Recent Monitors</CardTitle>
            <CardDescription>
              Your most recently created monitors.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.dashboard.monitors.list}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentMonitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Radio className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No monitors yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first monitor to start tracking changes.
              </p>
              <Button asChild>
                <Link href={ROUTES.dashboard.monitors.new}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Monitor
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMonitors.map((monitor) => (
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
                      {monitor.url}
                    </TableCell>
                    <TableCell className="text-right">
                      Every {monitor.frequencyMinutes}m
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
