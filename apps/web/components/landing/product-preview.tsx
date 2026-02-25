import { Badge, Button } from "@trackrel/ui";
import { Logo } from "@/components/logo";
import { CheckCircle2, Clock, MoreHorizontal, Play, Settings, ExternalLink } from "lucide-react";

export function ProductPreview() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            A dashboard built for speed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Manage all your monitors in one place. See status, history, and configure alerts with ease.
          </p>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl">
          {/* Mock Browser Header */}
          <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto flex h-6 w-full max-w-md items-center justify-center rounded-md bg-background text-xs text-muted-foreground shadow-sm">
              app.trackrel.com/dashboard
            </div>
          </div>

          {/* Mock App Content */}
          <div className="flex h-[500px] flex-col md:flex-row">
            {/* Sidebar */}
            <div className="hidden w-64 flex-col border-r border-border/50 bg-muted/10 p-4 md:flex">
              <div className="mb-8 flex items-center gap-2 px-2">
                <Logo size={20} className="text-primary" />
                <span className="font-display font-semibold">Trackrel</span>
              </div>
              <nav className="space-y-1">
                <div className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                  <Clock className="h-4 w-4" />
                  Monitors
                </div>
                <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50">
                  <CheckCircle2 className="h-4 w-4" />
                  History
                </div>
                <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50">
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold">Monitors</h1>
                  <p className="text-sm text-muted-foreground">Manage your active website monitors.</p>
                </div>
                <Button size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  New Monitor
                </Button>
              </div>

              <div className="rounded-lg border border-border/50 bg-background">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 border-b border-border/50 bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground">
                  <div className="col-span-5">Name & URL</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">Last Checked</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-border/50">
                  {/* Row 1 */}
                  <div className="grid grid-cols-12 items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/20">
                    <div className="col-span-5">
                      <div className="font-medium">Competitor Pricing</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        acme.com/pricing <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
                    </div>
                    <div className="col-span-3 text-sm text-muted-foreground">
                      2 mins ago
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-12 items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/20">
                    <div className="col-span-5">
                      <div className="font-medium">API Docs Changes</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        stripe.com/docs/api <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Changed</Badge>
                    </div>
                    <div className="col-span-3 text-sm text-muted-foreground">
                      15 mins ago
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-12 items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/20">
                    <div className="col-span-5">
                      <div className="font-medium">Supplier Stock Status</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        supplier.com/item/123 <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Failing</Badge>
                    </div>
                    <div className="col-span-3 text-sm text-muted-foreground">
                      1 hour ago
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
