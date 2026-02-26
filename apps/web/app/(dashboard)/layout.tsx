import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import { ROUTES } from "@/lib/routes";
import { Sidebar } from "./dashboard/components/sidebar";
import { DashboardHeader } from "./dashboard/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.auth.login);
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <DashboardHeader user={{ ...session.user, image: session.user.image ?? null }} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
