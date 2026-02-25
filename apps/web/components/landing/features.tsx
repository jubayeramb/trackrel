import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@trackrel/ui";
import { BrainCircuit, MousePointer2, Bell, History, Clock, Users } from "lucide-react";

const features = [
  {
    title: "Smart Change Detection",
    description: "Paste a URL and our AI auto-generates robust CSS selectors to watch specific page elements, ignoring irrelevant noise.",
    icon: BrainCircuit,
  },
  {
    title: "Visual Selector Tool",
    description: "Use our Chrome extension to visually point-and-click on the exact elements you want to monitor. No coding required.",
    icon: MousePointer2,
  },
  {
    title: "Flexible Alerts",
    description: "Get notified instantly via Email, Slack, or Webhooks when changes are detected. Customize alert thresholds.",
    icon: Bell,
  },
  {
    title: "Full Check History",
    description: "Access a complete diff history of every change detected, complete with before and after snapshots for context.",
    icon: History,
  },
  {
    title: "Custom Scheduling",
    description: "Monitor on your terms. Set custom intervals from every 5 minutes to daily or weekly checks.",
    icon: Clock,
  },
  {
    title: "Team Collaboration",
    description: "Share monitors across your organization. Collaborate on tracking competitor pricing or API changes.",
    icon: Users,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to track the web
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful tools designed for product managers, developers, and researchers who need to stay ahead of changes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group relative overflow-hidden border-border/50 bg-card transition-all hover:shadow-md hover:border-primary/30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
