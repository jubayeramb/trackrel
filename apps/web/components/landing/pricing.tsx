import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@trackrel/ui";
import { Check } from "lucide-react";

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

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
          {/* Free Tier */}
          <Card className="flex flex-col border-border/50 bg-card shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-8 pt-10">
              <CardTitle className="font-display text-2xl">Free</CardTitle>
              <CardDescription className="mt-2 text-base">Perfect for personal projects and trying out Trackrel.</CardDescription>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                $0
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
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
            <CardFooter className="pb-10">
              <Button variant="outline" className="w-full h-12 text-base font-semibold" asChild>
                <a href="/signup">Get Started Free</a>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="relative flex flex-col border-primary/50 bg-card shadow-lg shadow-primary/5 transition-all hover:shadow-xl hover:shadow-primary/10">
            <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-4 py-1 text-sm font-bold text-primary-foreground shadow-sm">
              Most Popular
            </div>
            <CardHeader className="pb-8 pt-10">
              <CardTitle className="font-display text-2xl">Pro</CardTitle>
              <CardDescription className="mt-2 text-base">For professionals and teams who need reliable monitoring.</CardDescription>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                $9
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
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
            <CardFooter className="pb-10">
              <Button className="w-full h-12 text-base font-semibold shadow-md" asChild>
                <a href="/signup">Start Pro Trial</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
