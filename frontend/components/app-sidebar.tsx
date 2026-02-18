"use client";

import { useState, useEffect } from "react"; // Added useEffect and useState
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LayoutDashboard,
  Users,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  // 1. Add a mounted state
  const [mounted, setMounted] = useState(false);

  // 2. Set mounted to true once the component runs on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="flex w-60 h-screen flex-col border-r bg-sidebar text-sidebar-foreground">
      <Link
        href="/"
        className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4 transition-colors hover:bg-sidebar-accent/50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <BarChart3 className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-primary-foreground">
          CRM Lite
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent outline-none">
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-sidebar-border bg-muted">
                {/* 3. Only show user data if mounted */}
                {mounted && user?.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col overflow-hidden text-left">
                <span className="text-sm font-medium truncate text-sidebar-foreground">
                  {mounted ? user?.fullName || "Account" : "Loading..."}
                </span>
                <span className="text-xs truncate text-sidebar-foreground/50">
                  {mounted ? user?.primaryEmailAddress?.emailAddress : ""}
                </span>
              </div>
              {/* Chevron icon */}
              <div className="text-sidebar-foreground/30 group-hover:text-sidebar-foreground/70">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 mb-2 ml-2"
            align="start"
            side="right"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {mounted ? user?.fullName : ""}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {mounted ? user?.primaryEmailAddress?.emailAddress : ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => openUserProfile()}
              className="cursor-pointer"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Manage Account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut()}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
