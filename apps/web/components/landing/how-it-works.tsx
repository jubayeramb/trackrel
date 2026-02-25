import { Link2, Sparkles, BellRing } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-24 lg:py-32 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How Trackrel works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Set up a monitor in seconds. No coding required.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Connecting line for desktop */}
          <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 bg-border/50 md:block"></div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-primary shadow-sm ring-1 ring-border/50">
                <Link2 className="h-10 w-10" />
              </div>
              <div className="mt-8">
                <div className="mb-2 inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                  Step 1
                </div>
                <h3 className="font-display text-xl font-bold">Paste URL</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Enter the website URL you want to track, or use our Chrome extension to visually select elements.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-primary shadow-sm ring-1 ring-border/50">
                <Sparkles className="h-10 w-10" />
              </div>
              <div className="mt-8">
                <div className="mb-2 inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                  Step 2
                </div>
                <h3 className="font-display text-xl font-bold">AI Selection</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Trackrel's AI automatically generates robust CSS selectors to watch the specific content you care about.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-primary shadow-sm ring-1 ring-border/50">
                <BellRing className="h-10 w-10" />
              </div>
              <div className="mt-8">
                <div className="mb-2 inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                  Step 3
                </div>
                <h3 className="font-display text-xl font-bold">Get Alerted</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Receive instant notifications via Email, Slack, or Webhook the moment a change is detected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
