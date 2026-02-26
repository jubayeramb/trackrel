"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@trackrel/ui";
import { signOut } from "@/lib/auth-client";
import type { SelectUser } from "@trackrel/db";
import { ROUTES } from "@/lib/routes";

interface DashboardHeaderProps {
  user: SelectUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  // Simple breadcrumb logic
  const getTitle = () => {
    if (pathname === ROUTES.dashboard.home) return "Overview";
    if (pathname === ROUTES.dashboard.monitors.list) return "Monitors";
    if (pathname === ROUTES.dashboard.monitors.new) return "New Monitor";
    if (pathname.includes("/edit")) return "Edit Monitor";
    if (pathname.startsWith(ROUTES.dashboard.monitors.list + "/")) return "Monitor Details";
    return "Dashboard";
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      <div className="w-full flex-1">
        <h1 className="font-display text-lg font-semibold">{getTitle()}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={ROUTES.dashboard.settings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = ROUTES.auth.login; } } })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
