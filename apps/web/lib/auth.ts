import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import * as schema from "@trackrel/db";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env["GOOGLE_CLIENT_ID"] as string,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] as string,
    },
    github: {
      clientId: process.env["GITHUB_CLIENT_ID"] as string,
      clientSecret: process.env["GITHUB_CLIENT_SECRET"] as string,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // TODO: integrate email service (Resend, etc.)
        console.log(`Magic link for ${email}: ${url}`);
      },
    }),
    nextCookies(), // Must be last plugin
  ],
});

export type Auth = typeof auth;
