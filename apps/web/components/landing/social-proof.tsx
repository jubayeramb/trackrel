export function SocialProof() {
  return (
    <section className="border-y border-border/40 bg-muted/30 py-12">
      <div className="container mx-auto px-4 md:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale transition-all hover:grayscale-0 md:gap-16">
          {/* Placeholder logos using SVG */}
          <svg className="h-8 w-auto text-foreground" viewBox="0 0 100 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="4" y="5" />
            <text x="28" y="20" fontFamily="sans-serif" fontSize="16" fontWeight="bold">Acme Corp</text>
          </svg>
          <svg className="h-8 w-auto text-foreground" viewBox="0 0 100 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="10" />
            <text x="32" y="20" fontFamily="sans-serif" fontSize="16" fontWeight="bold">Globex</text>
          </svg>
          <svg className="h-8 w-auto text-foreground" viewBox="0 0 100 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <polygon points="15,5 25,25 5,25" />
            <text x="32" y="20" fontFamily="sans-serif" fontSize="16" fontWeight="bold">Soylent</text>
          </svg>
          <svg className="h-8 w-auto text-foreground" viewBox="0 0 100 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect width="15" height="15" transform="rotate(45 15 15)" y="5" />
            <text x="35" y="20" fontFamily="sans-serif" fontSize="16" fontWeight="bold">Initech</text>
          </svg>
          <svg className="h-8 w-auto text-foreground hidden sm:block" viewBox="0 0 100 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 15 Q 15 5 25 15 T 45 15" stroke="currentColor" strokeWidth="4" fill="none" />
            <text x="52" y="20" fontFamily="sans-serif" fontSize="16" fontWeight="bold">Umbrella</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
