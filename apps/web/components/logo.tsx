import { cn } from "@trackrel/ui";

/**
 * Trackrel logo mark.
 *
 * Concept: A rounded square (the "web page") containing a stylized spike
 * that doubles as the letter T — crossbar at top with a narrow spike
 * dropping down from center. The silhouette reads as T for Trackrel;
 * the downward spike pins the detected change. A dot marks the tip.
 *
 * Designed to remain legible at 16 px (favicon) and scale gracefully.
 */

interface LogoProps {
  /** Width & height in px. Defaults to 32. */
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Page frame */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      {/* T-spike: narrow peak + wide baseline = T silhouette + detection spike */}
      <path
        d="M5 9 L10.5 9 L12 19 L13.5 9 L19 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Detection dot at peak */}
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** Monochrome version for favicon / Open Graph. */
export function LogoMark({ size = 512, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="512" height="512" rx="108" fill="currentColor" />

      {/* T-spike — inverted color */}
      <path
        d="M106 192 L224 192 L256 406 L288 192 L406 192"
        stroke="white"
        strokeWidth="42"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Detection dot */}
      <circle cx="256" cy="406" r="30" fill="white" />
    </svg>
  );
}
