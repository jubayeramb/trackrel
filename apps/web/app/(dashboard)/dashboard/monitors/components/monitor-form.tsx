"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@trackrel/ui";
import { createMonitor, updateMonitor } from "@/lib/actions/monitors";
import { createMonitorSchema } from "@trackrel/db/validation";
import type { SelectMonitor } from "@trackrel/db";
import { toast } from "sonner";

interface MonitorFormProps {
  initialData?: SelectMonitor;
}

export function MonitorForm({ initialData }: MonitorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const isEditing = !!initialData;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      selector: formData.get("selector") as string,
      frequencyMinutes: parseInt(formData.get("frequencyMinutes") as string, 10),
    };

    const parsed = createMonitorSchema.safeParse(data);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = isEditing
        ? await updateMonitor(initialData.id, parsed.data)
        : await createMonitor(parsed.data);

      if (result.success) {
        toast.success(isEditing ? "Monitor updated" : "Monitor created");
        router.push(isEditing ? `/dashboard/monitors/${initialData.id}` : "/dashboard/monitors");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Monitor" : "Create Monitor"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the configuration for this monitor."
              : "Set up a new website monitor to track changes."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Pricing Page"
              defaultValue={initialData?.name}
              required
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com"
              defaultValue={initialData?.url}
              required
            />
            {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="selector">CSS Selector</Label>
            <Input
              id="selector"
              name="selector"
              placeholder="e.g. .price-tag, #main-content"
              defaultValue={initialData?.selector}
              required
            />
            <p className="text-xs text-muted-foreground">
              The CSS selector of the element you want to track.
            </p>
            {errors.selector && <p className="text-sm text-destructive">{errors.selector}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequencyMinutes">Check Frequency</Label>
            <Select name="frequencyMinutes" defaultValue={initialData?.frequencyMinutes?.toString() || "60"}>
              <SelectTrigger id="frequencyMinutes">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every 1 hour</SelectItem>
                <SelectItem value="360">Every 6 hours</SelectItem>
                <SelectItem value="720">Every 12 hours</SelectItem>
                <SelectItem value="1440">Every 24 hours</SelectItem>
              </SelectContent>
            </Select>
            {errors.frequencyMinutes && (
              <p className="text-sm text-destructive">{errors.frequencyMinutes}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Monitor"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
