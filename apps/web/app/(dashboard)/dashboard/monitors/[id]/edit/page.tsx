import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@trackrel/ui";
import { getMonitor } from "@/lib/actions/monitors";
import { MonitorForm } from "../../components/monitor-form";

interface EditMonitorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMonitorPage({ params }: EditMonitorPageProps) {
  const { id } = await params;
  const result = await getMonitor(id);

  if (!result.success) {
    notFound();
  }

  const monitor = result.data;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/monitors/${monitor.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to monitor</span>
          </Link>
        </Button>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Edit Monitor</h2>
          <p className="text-muted-foreground">
            Update the configuration for {monitor.name}.
          </p>
        </div>
      </div>

      <MonitorForm initialData={monitor} />
    </div>
  );
}
