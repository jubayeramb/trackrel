import { Button, Input } from "@trackrel/ui";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/50 bg-card/50 p-8 shadow-2xl backdrop-blur-sm sm:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/10 blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-primary/10 blur-[80px]"></div>

          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to stop missing changes?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Join thousands of professionals who use Trackrel to monitor competitor pricing, API docs, and critical website updates.
          </p>
          
          <form className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-14 flex-1 rounded-xl border-border/50 bg-background px-4 text-base shadow-sm focus-visible:ring-primary"
              required
            />
            <Button type="submit" size="lg" className="h-14 rounded-xl px-8 text-base font-semibold shadow-md transition-transform hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Start monitoring for free.
          </p>
        </div>
      </div>
    </section>
  );
}
