import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@trackrel/ui";
import { Check } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export function Pricing() {
  return (
    <section id="pricing" className="bg-muted/30 py-24 lg:py-32 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start for free, upgrade when you need more power.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 pt-6 md:grid-cols-2 lg:gap-12">
          {/* Free Tier */}
          <Card className="flex flex-col border-border/50 bg-card shadow-sm transition-all hover:shadow-md hover:border-border">
            <CardHeader className="px-8 pb-6 pt-8">
              <CardTitle className="font-display text-2xl">Free</CardTitle>
              <CardDescription className="mt-2 text-base">Perfect for personal projects and trying out Trackrel.</CardDescription>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                $0
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-8">
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground">3 active monitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Hourly checks</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Email alerts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground">7-day check history</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Community support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-4">
              <Button variant="outline" className="w-full h-12 text-base font-semibold" asChild>
                <a href={ROUTES.auth.signup}>Get Started Free</a>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="relative flex flex-col overflow-visible border-primary/50 bg-card shadow-lg shadow-primary/5 transition-all hover:shadow-xl hover:shadow-primary/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 rounded-full bg-primary px-4 py-1 text-xs font-bold tracking-wide uppercase text-primary-foreground shadow-md">
              Most Popular
            </div>
            <CardHeader className="px-8 pb-6 pt-8">
              <CardTitle className="font-display text-2xl">Pro</CardTitle>
              <CardDescription className="mt-2 text-base">For professionals and teams who need reliable monitoring.</CardDescription>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                $9
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-8">
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Unlimited monitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">5-minute checks</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Slack & Webhook alerts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Unlimited check history</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Team sharing</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-4">
              <Button className="w-full h-12 text-base font-semibold shadow-md" asChild>
                <a href={ROUTES.auth.signup}>Start Pro Trial</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
