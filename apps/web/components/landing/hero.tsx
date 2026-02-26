import Link from "next/link";
import { Button } from "@trackrel/ui";
import { ArrowRight, MousePointerClick, BellRing } from "lucide-react";
import { AnimatedBadge } from "./animated-badge";
import { ROUTES } from "@/lib/routes";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-36 lg:pb-40">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/5 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/3 rounded-full bg-primary/5 blur-[100px]"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedBadge />
          
          <h1 className="font-display mb-8 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Monitor any website. <br className="hidden sm:block" />
            <span className="text-primary">Get alerted instantly.</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Trackrel&apos;s AI auto-generates CSS selectors to watch specific page elements.
            Track competitor prices, API docs, or stock status without writing a single line of code.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5" asChild>
              <Link href={ROUTES.auth.signup}>
                Start Monitoring Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold transition-transform hover:-translate-y-0.5" asChild>
              <Link href="#how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-primary" />
              <span>Point & click setup</span>
            </div>
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary" />
              <span>Real-time alerts</span>
            </div>
          </div>
        </div>

        {/* Abstract visual element */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="relative rounded-2xl border border-border/50 bg-card/50 p-2 shadow-2xl backdrop-blur-sm">
            <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="absolute -bottom-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            <div className="rounded-xl border border-border/50 bg-background p-4 sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="h-6 w-64 rounded-md bg-muted/50"></div>
              </div>
              
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border border-border/50 bg-muted/20 p-6">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 rounded bg-muted"></div>
                    <div className="h-5 w-16 rounded bg-muted"></div>
                  </div>
                  <div className="h-24 rounded-md bg-muted/50 p-4">
                    <div className="h-4 w-3/4 rounded bg-muted"></div>
                    <div className="mt-2 h-4 w-1/2 rounded bg-muted"></div>
                    <div className="mt-6 flex items-center gap-2">
                      <div className="h-8 w-24 rounded bg-red-500/10 text-xs font-medium text-red-600 dark:text-red-400 flex items-center justify-center line-through decoration-red-600/50 dark:decoration-red-400/50">$299.00</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 rounded bg-primary/20"></div>
                    <div className="h-5 w-16 rounded bg-primary/20"></div>
                  </div>
                  <div className="h-24 rounded-md bg-background p-4 border border-primary/10 shadow-sm">
                    <div className="h-4 w-3/4 rounded bg-muted"></div>
                    <div className="mt-2 h-4 w-1/2 rounded bg-muted"></div>
                    <div className="mt-6 flex items-center gap-2">
                      <div className="h-8 w-24 rounded bg-green-500/10 text-xs font-medium text-green-600 dark:text-green-400 flex items-center justify-center">$249.00</div>
                      <div className="h-6 px-2 rounded-full bg-primary/20 text-[10px] font-bold text-primary flex items-center justify-center">PRICE DROP</div>
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
