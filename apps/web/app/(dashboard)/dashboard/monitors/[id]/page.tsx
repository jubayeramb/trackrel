import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Globe, Activity } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@trackrel/ui";
import { getMonitor, getCheckLogs } from "@/lib/actions/monitors";
import { MonitorActions } from "./components/monitor-actions";
import { ROUTES } from "@/lib/routes";

interface MonitorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MonitorDetailPage({ params }: MonitorDetailPageProps) {
  const { id } = await params;
  const [monitorResult, logsResult] = await Promise.all([
    getMonitor(id),
    getCheckLogs(id),
  ]);

  if (!monitorResult.success) {
    notFound();
  }

  const monitor = monitorResult.data;
  const logs = logsResult.success ? logsResult.data : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.dashboard.monitors.list}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to monitors</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {monitor.name}
              </h2>
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
            </div>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <Globe className="h-3 w-3" />
              <a
                href={monitor.url}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {monitor.url}
              </a>
            </p>
          </div>
        </div>
        <MonitorActions monitorId={monitor.id} monitorName={monitor.name} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Every {monitor.frequencyMinutes}m</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSS Selector</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-mono font-medium truncate" title={monitor.selector}>
              {monitor.selector}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Checked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {monitor.lastCheckAt
                ? new Date(monitor.lastCheckAt).toLocaleString()
                : "Never"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check Logs</CardTitle>
          <CardDescription>
            Recent checks performed for this monitor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No logs yet</h3>
              <p className="text-sm text-muted-foreground">
                Checks will appear here once the monitor runs.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Checked At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Detected Text</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.checkedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {log.statusCode ? (
                        <Badge
                          variant={
                            log.statusCode >= 200 && log.statusCode < 300
                              ? "default"
                              : "destructive"
                          }
                        >
                          {log.statusCode}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Unknown</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.responseTimeMs ? `${log.responseTimeMs}ms` : "-"}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {log.detectedTextSnapshot || "-"}
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
