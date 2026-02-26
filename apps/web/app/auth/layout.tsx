import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { getSession } from "@/lib/auth-session";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Authentication | Trackrel",
  description: "Sign in or create an account for Trackrel.",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session) {
    redirect(ROUTES.dashboard.home);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="text-primary transition-transform group-hover:scale-105" />
          <span className="font-display font-bold text-xl tracking-tight">Trackrel</span>
        </Link>
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
