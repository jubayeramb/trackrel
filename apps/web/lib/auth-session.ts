import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Get the current authenticated session in a server component or server action.
 * Returns null if the user is not authenticated.
 */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Get the current authenticated session or throw.
 * Use in server actions where auth is required.
 */
export async function requireSession() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
