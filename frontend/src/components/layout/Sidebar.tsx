"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, History, Star, Settings, BrainCircuit, Mic } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Examiner", href: "/ai-viva", icon: Mic },
  { name: "Subjects", href: "/dashboard/subjects", icon: FileText },
  { name: "Practice History", href: "/dashboard/history", icon: History },
  { name: "Favorites", href: "/dashboard/favorites", icon: Star },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border/50">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Smart Viva</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                    "mr-3 flex-shrink-0 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium">Test User</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
