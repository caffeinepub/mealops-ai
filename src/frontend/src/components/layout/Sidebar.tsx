import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Activity,
  BrainCircuit,
  ChevronLeft,
  LayoutDashboard,
  Package,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import type { Page, UserRole } from "../../App";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ocid: string;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    id: "meal_planning",
    label: "Meal Planning",
    icon: UtensilsCrossed,
    ocid: "nav.meal_planning.link",
  },
  {
    id: "ai_recommendations",
    label: "AI Recommendations",
    icon: BrainCircuit,
    ocid: "nav.ai_recommendations.link",
  },
  {
    id: "resource_tracking",
    label: "Resource Tracking",
    icon: Package,
    ocid: "nav.resource_tracking.link",
  },
  {
    id: "delivery_tracking",
    label: "Delivery Tracking",
    icon: Truck,
    ocid: "nav.delivery_tracking.link",
  },
];

export function Sidebar({
  currentPage,
  onNavigate,
  userRole,
  onRoleChange,
  collapsed,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-20 shrink-0",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border shrink-0 h-14">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 shrink-0">
          <Activity className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-sidebar-foreground tracking-tight">
              MealOps
            </span>
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
              AI Platform
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="ml-auto p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-0.5">
          {!collapsed && (
            <p className="text-[10px] font-mono text-sidebar-foreground/30 uppercase tracking-widest px-3 py-2">
              Navigation
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={item.ocid}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-primary" : "",
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Role Switcher */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        {collapsed ? (
          <button
            type="button"
            onClick={() =>
              onRoleChange(
                userRole === "kitchen_staff" ? "nurse" : "kitchen_staff",
              )
            }
            className={cn(
              "w-full flex justify-center p-2 rounded-md text-xs transition-colors",
              userRole === "nurse"
                ? "bg-chart-4/15 text-chart-4"
                : "bg-primary/15 text-primary",
            )}
            title={`Role: ${userRole === "kitchen_staff" ? "Kitchen Staff" : "Nurse"}`}
          >
            {userRole === "nurse" ? "👩‍⚕️" : "👨‍🍳"}
          </button>
        ) : (
          <div
            className="p-3 rounded-lg bg-sidebar-accent space-y-2"
            data-ocid="role_switcher.select"
          >
            <p className="text-[10px] font-mono text-sidebar-foreground/40 uppercase tracking-widest">
              Active Role
            </p>
            <div className="flex items-center justify-between gap-2">
              <Label
                htmlFor="role-toggle"
                className={cn(
                  "text-xs font-medium cursor-pointer transition-colors",
                  userRole === "kitchen_staff"
                    ? "text-primary"
                    : "text-sidebar-foreground/50",
                )}
              >
                Kitchen
              </Label>
              <Switch
                id="role-toggle"
                checked={userRole === "nurse"}
                onCheckedChange={(checked) =>
                  onRoleChange(checked ? "nurse" : "kitchen_staff")
                }
                className="data-[state=checked]:bg-chart-4 data-[state=unchecked]:bg-primary/60"
              />
              <Label
                htmlFor="role-toggle"
                className={cn(
                  "text-xs font-medium cursor-pointer transition-colors",
                  userRole === "nurse"
                    ? "text-chart-4"
                    : "text-sidebar-foreground/50",
                )}
              >
                Nurse
              </Label>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
