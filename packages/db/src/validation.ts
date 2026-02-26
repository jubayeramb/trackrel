import * as z from "zod";

// ── Auth Validation ───────────────────────────────────────────────────────

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ── Monitor Validation ────────────────────────────────────────────────────

export const createMonitorSchema = z.object({
  url: z.string().url("Invalid URL"),
  selector: z.string().min(1, "CSS selector is required"),
  name: z.string().min(1, "Name is required").max(256),
  frequencyMinutes: z.number().int().min(5).max(1440).default(60),
});

export const updateMonitorSchema = createMonitorSchema.partial();

// ── Inferred Input Types ──────────────────────────────────────────────────

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
export type UpdateMonitorInput = z.infer<typeof updateMonitorSchema>;
