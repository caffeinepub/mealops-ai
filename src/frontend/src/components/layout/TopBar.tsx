import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Bell, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { Page, UserRole } from "../../App";
import { kpiData } from "../../data/mockData";

const PAGE_LABELS: Record<Page, string> = {
  dashboard: "Dashboard",
  meal_planning: "Patient Meal Planning",
  ai_recommendations: "AI Recommendations",
  resource_tracking: "Resource Tracking",
  delivery_tracking: "Delivery Tracking",
};

interface TopBarProps {
  currentPage: Page;
  userRole: UserRole;
  onMenuToggle: () => void;
}

export function TopBar({ currentPage, userRole, onMenuToggle }: TopBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = time.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="flex items-center gap-4 px-4 h-14 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
      <button
        type="button"
        onClick={onMenuToggle}
        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-foreground">
          {PAGE_LABELS[currentPage]}
        </h1>
        <span className="hidden sm:block text-xs text-muted-foreground/50">
          |
        </span>
        <span className="hidden sm:block text-xs text-muted-foreground">
          {userRole === "nurse" ? "Nurse View" : "Kitchen Staff View"}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Live clock */}
      <div className="hidden sm:flex flex-col items-end leading-tight">
        <span className="font-mono text-sm text-foreground tabular-nums">
          {timeStr}
        </span>
        <span className="text-[10px] text-muted-foreground">{dateStr}</span>
      </div>

      {/* Alert badge */}
      <div className="relative">
        <button
          type="button"
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-4 h-4" />
          {kpiData.activeAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              {kpiData.activeAlerts}
            </span>
          )}
        </button>
      </div>

      {/* User */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 p-1 rounded-md hover:bg-accent transition-colors"
          >
            <Avatar className="w-7 h-7">
              <AvatarFallback
                className={cn(
                  "text-[11px] font-bold",
                  userRole === "nurse"
                    ? "bg-chart-4/20 text-chart-4"
                    : "bg-primary/20 text-primary",
                )}
              >
                {userRole === "nurse" ? "RN" : "KS"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-xs font-medium text-foreground">
              {userRole === "nurse" ? "Nurse Kelly" : "Chef Marcus"}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem className="text-xs">
            <User className="w-3 h-3 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs text-muted-foreground">
            v2.4.1 – MealOps AI
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status dot */}
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-status-ok animate-pulse-slow" />
        <Badge
          variant="outline"
          className="text-[10px] font-mono text-status-ok border-status-ok/40 bg-status-ok/10 hidden sm:flex"
        >
          LIVE
        </Badge>
      </div>
    </header>
  );
}
