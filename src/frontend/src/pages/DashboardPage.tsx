import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Clock,
  Flag,
  Pencil,
  RefreshCw,
  ShoppingCart,
  Target,
  TrendingDown,
  Truck,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  activityFeed,
  kpiData as initialKpiData,
  mealsPerHourData as initialMealsPerHourData,
  kitchenStations,
} from "../data/mockData";
import type { StationStatus } from "../data/mockData";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface KpiState {
  mealsServedToday: number;
  kitchenThroughput: number;
  onTimeDeliveryPercent: number;
  wasteReductionPercent: number;
  totalPatientsToday: number;
  mealsProducedPerHour: number;
  activeAlerts: number;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color,
  onEdit,
  ocid,
}: {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color: "teal" | "amber" | "green" | "blue" | "purple";
  onEdit: () => void;
  ocid: string;
}) {
  const colorMap = {
    teal: "text-primary bg-primary/10 border-primary/20",
    amber: "text-chart-2 bg-chart-2/10 border-chart-2/20",
    green: "text-chart-5 bg-chart-5/10 border-chart-5/20",
    blue: "text-status-info bg-status-info/10 border-status-info/20",
    purple: "text-chart-4 bg-chart-4/10 border-chart-4/20",
  };
  const iconColor = {
    teal: "text-primary",
    amber: "text-chart-2",
    green: "text-chart-5",
    blue: "text-status-info",
    purple: "text-chart-4",
  };

  return (
    <Card
      className="relative overflow-hidden bg-card border-border hover:border-border/80 transition-colors group"
      data-ocid={ocid}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {value}
              </span>
              {unit && (
                <span className="text-xs text-muted-foreground">{unit}</span>
              )}
            </div>
            {trend && (
              <p className="text-xs text-muted-foreground mt-0.5">{trend}</p>
            )}
          </div>
          <div className="flex items-start gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              data-ocid={`${ocid}.edit_button`}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              aria-label={`Edit ${title}`}
            >
              <Pencil className="w-3 h-3" />
            </Button>
            <div className={cn("p-2 rounded-lg border", colorMap[color])}>
              <Icon className={cn("w-4 h-4", iconColor[color])} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface EditKpiDialogProps {
  open: boolean;
  title: string;
  currentValue: number;
  unit?: string;
  min?: number;
  max?: number;
  onClose: () => void;
  onSave: (value: number) => void;
}

function EditKpiDialog({
  open,
  title,
  currentValue,
  unit,
  min = 0,
  max = 99999,
  onClose,
  onSave,
}: EditKpiDialogProps) {
  const [inputVal, setInputVal] = useState(String(currentValue));
  const [error, setError] = useState("");

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setInputVal(String(currentValue));
      setError("");
      onClose();
    }
  };

  const handleSave = () => {
    const num = Number(inputVal);
    if (Number.isNaN(num) || !inputVal.trim()) {
      setError("Please enter a valid number");
      return;
    }
    if (num < min || num > max) {
      setError(`Value must be between ${min} and ${max}`);
      return;
    }
    onSave(num);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="dashboard.edit_kpi.dialog"
        className="max-w-xs bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Edit {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="kpi-value" className="text-xs font-medium">
              New Value{unit ? ` (${unit})` : ""}
            </Label>
            <Input
              id="kpi-value"
              data-ocid="dashboard.edit_kpi.input"
              type="number"
              min={min}
              max={max}
              className={cn(
                "h-8 text-xs bg-muted/50 border-border font-mono",
                error && "border-status-critical",
              )}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            {error && (
              <p
                data-ocid="dashboard.edit_kpi.error_state"
                className="text-[10px] text-status-critical"
              >
                {error}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            data-ocid="dashboard.edit_kpi.cancel_button"
            className="text-xs border-border"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            data-ocid="dashboard.edit_kpi.save_button"
            className="text-xs"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditTargetDialogProps {
  open: boolean;
  currentTarget: number;
  onClose: () => void;
  onSave: (value: number) => void;
}

function EditTargetDialog({
  open,
  currentTarget,
  onClose,
  onSave,
}: EditTargetDialogProps) {
  const [inputVal, setInputVal] = useState(String(currentTarget));
  const [error, setError] = useState("");

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setInputVal(String(currentTarget));
      setError("");
      onClose();
    }
  };

  const handleSave = () => {
    const num = Number(inputVal);
    if (Number.isNaN(num) || !inputVal.trim() || num < 1 || num > 200) {
      setError("Enter a valid target between 1 and 200");
      return;
    }
    onSave(num);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="dashboard.edit_target.dialog"
        className="max-w-xs bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">
            Edit Hourly Target
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <p className="text-xs text-muted-foreground">
            Set a uniform meals-per-hour target for all time slots on the chart.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="target-value" className="text-xs font-medium">
              Target (meals/hr)
            </Label>
            <Input
              id="target-value"
              data-ocid="dashboard.edit_target.input"
              type="number"
              min={1}
              max={200}
              className={cn(
                "h-8 text-xs bg-muted/50 border-border font-mono",
                error && "border-status-critical",
              )}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            {error && (
              <p
                data-ocid="dashboard.edit_target.error_state"
                className="text-[10px] text-status-critical"
              >
                {error}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            data-ocid="dashboard.edit_target.cancel_button"
            className="text-xs border-border"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            data-ocid="dashboard.edit_target.save_button"
            className="text-xs"
            onClick={handleSave}
          >
            Apply to All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Statics ─────────────────────────────────────────────────────────────────

const stationStatusColors: Record<StationStatus, string> = {
  Active: "bg-status-ok/15 text-status-ok border-status-ok/30",
  Idle: "bg-status-idle/15 text-status-idle border-status-idle/30",
  Alert: "bg-status-critical/15 text-status-critical border-status-critical/30",
};

const stationLoadColor = (load: number) => {
  if (load >= 90) return "bg-status-critical";
  if (load >= 75) return "bg-status-warning";
  return "bg-primary";
};

const activityIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  meal_prepared: UtensilsCrossed,
  cart_dispatched: Truck,
  dietary_flag: Flag,
  ai_alert: BrainCircuit,
  delivery_completed: ShoppingCart,
  restock_alert: RefreshCw,
  staff_update: Users,
};

const activitySeverityColors: Record<string, string> = {
  critical: "text-status-critical",
  warning: "text-status-warning",
  info: "text-muted-foreground",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-xs space-y-1">
        <p className="font-mono text-muted-foreground">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-bold font-mono">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── KPI definitions ──────────────────────────────────────────────────────────

type KpiKey = keyof Omit<KpiState, "activeAlerts">;

interface KpiDefinition {
  key: KpiKey;
  title: string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "teal" | "amber" | "green" | "blue" | "purple";
  min: number;
  max: number;
  isPercent?: boolean;
}

const kpiDefinitions: KpiDefinition[] = [
  {
    key: "mealsServedToday",
    title: "Meals Served Today",
    unit: "meals",
    icon: UtensilsCrossed,
    color: "teal",
    min: 0,
    max: 9999,
  },
  {
    key: "totalPatientsToday",
    title: "Number of Patients",
    unit: "patients",
    icon: Users,
    color: "purple",
    min: 0,
    max: 9999,
  },
  {
    key: "kitchenThroughput",
    title: "Kitchen Throughput",
    unit: "meals/hr",
    icon: Zap,
    color: "amber",
    min: 0,
    max: 999,
  },
  {
    key: "onTimeDeliveryPercent",
    title: "On-Time Delivery",
    icon: Clock,
    color: "green",
    min: 0,
    max: 100,
    isPercent: true,
  },
  {
    key: "wasteReductionPercent",
    title: "Waste Reduction",
    icon: TrendingDown,
    color: "blue",
    min: 0,
    max: 100,
    isPercent: true,
  },
  {
    key: "mealsProducedPerHour",
    title: "Meals Produced/hr",
    unit: "meals/hr",
    icon: Activity,
    color: "teal",
    min: 0,
    max: 999,
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [kpi, setKpi] = useState<KpiState>({
    ...initialKpiData,
    mealsProducedPerHour: 32,
  });

  const [mealsPerHourData, setMealsPerHourData] = useState(
    initialMealsPerHourData,
  );

  // Edit KPI dialog state
  const [editingKpi, setEditingKpi] = useState<KpiDefinition | null>(null);
  const [editTargetOpen, setEditTargetOpen] = useState(false);

  const criticalAlerts = activityFeed.filter((e) => e.severity === "critical");

  const handleSaveKpi = (def: KpiDefinition, value: number) => {
    setKpi((prev) => ({ ...prev, [def.key]: value }));
    toast.success(`${def.title} updated`, {
      description: `New value: ${value}${def.isPercent ? "%" : def.unit ? ` ${def.unit}` : ""}`,
    });
  };

  const handleSaveTarget = (value: number) => {
    setMealsPerHourData((prev) => prev.map((d) => ({ ...d, target: value })));
    toast.success("Hourly target updated", {
      description: `Target set to ${value} meals/hr for all time slots`,
    });
  };

  return (
    <div
      data-ocid="dashboard.page"
      className="p-4 md:p-6 space-y-6 max-w-screen-2xl mx-auto"
    >
      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-status-critical/10 border border-status-critical/30 glow-critical">
          <AlertTriangle className="w-5 h-5 text-status-critical shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-status-critical">
              {criticalAlerts.length} Critical Alert
              {criticalAlerts.length > 1 ? "s" : ""} Require Immediate Attention
            </p>
            <p className="text-xs text-status-critical/80 mt-0.5 line-clamp-1">
              {criticalAlerts[0].message}
            </p>
          </div>
          <Badge className="shrink-0 bg-status-critical/20 text-status-critical border-status-critical/40 border text-[10px] font-mono">
            CRITICAL
          </Badge>
        </div>
      )}

      {/* KPI Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">
            Key Performance Indicators
          </h2>
          <p className="text-[10px] text-muted-foreground">
            Hover a card to edit
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpiDefinitions.map((def) => {
            const rawValue = kpi[def.key];
            const displayValue = def.isPercent ? `${rawValue}%` : rawValue;
            const ocid = `dashboard.kpi.${def.key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)}`;
            return (
              <KPICard
                key={def.key}
                title={def.title}
                value={displayValue}
                unit={def.isPercent ? undefined : def.unit}
                icon={def.icon}
                color={def.color}
                ocid={ocid}
                onEdit={() => setEditingKpi(def)}
              />
            );
          })}
        </div>
      </section>

      {/* Kitchen Stations + Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Kitchen Stations */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Kitchen Station Status
            </h2>
            <Badge
              variant="outline"
              className="text-[10px] font-mono text-primary border-primary/30 bg-primary/5"
            >
              LIVE
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kitchenStations.map((station) => (
              <Card
                key={station.id}
                className={cn(
                  "bg-card border transition-colors",
                  station.status === "Alert"
                    ? "border-status-critical/30 glow-critical"
                    : "border-border",
                )}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {station.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {station.currentTask}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded border shrink-0",
                        stationStatusColors[station.status],
                      )}
                    >
                      {station.status}
                    </span>
                  </div>

                  {/* Load bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                      <span>LOAD</span>
                      <span
                        className={
                          station.load >= 90
                            ? "text-status-critical"
                            : "text-foreground"
                        }
                      >
                        {station.load}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          stationLoadColor(station.load),
                        )}
                        style={{ width: `${station.load}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{station.staff} staff assigned</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Live Activity Feed
              </CardTitle>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              <div className="space-y-0">
                {activityFeed.map((event, index) => {
                  const Icon = activityIcons[event.type] || Activity;
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0",
                        index === 0 && "bg-accent/30",
                      )}
                    >
                      <div
                        className={cn(
                          "p-1 rounded shrink-0 mt-0.5",
                          event.severity === "critical"
                            ? "bg-status-critical/15"
                            : event.severity === "warning"
                              ? "bg-status-warning/15"
                              : "bg-muted",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-3 h-3",
                            activitySeverityColors[event.severity ?? "info"],
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/90 leading-snug line-clamp-2">
                          {event.message}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          {event.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {/* Meals Per Hour Chart */}
      <section>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Meals Produced Per Hour
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">
                  Last 8 hours
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid="dashboard.chart.edit_target.button"
                  className="h-6 px-2 text-[10px] border-border gap-1 hover:border-primary hover:text-primary"
                  onClick={() => setEditTargetOpen(true)}
                >
                  <Target className="w-2.5 h-2.5" />
                  Edit Target
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mealsPerHourData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.012 215 / 0.5)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{
                      fill: "oklch(0.55 0.015 210)",
                      fontSize: 10,
                      fontFamily: "Geist Mono",
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "oklch(0.55 0.015 210)",
                      fontSize: 10,
                      fontFamily: "Geist Mono",
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      fontSize: "11px",
                      fontFamily: "Geist Mono",
                      paddingTop: "8px",
                    }}
                    formatter={(value) => (
                      <span style={{ color: "oklch(0.55 0.015 210)" }}>
                        {value}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="meals"
                    name="Produced"
                    stroke="oklch(0.72 0.16 185)"
                    strokeWidth={2}
                    dot={{ fill: "oklch(0.72 0.16 185)", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="oklch(0.78 0.16 68)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="pt-2 pb-4 text-center">
        <p className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Edit KPI Dialog */}
      {editingKpi && (
        <EditKpiDialog
          open={editingKpi !== null}
          title={editingKpi.title}
          currentValue={kpi[editingKpi.key]}
          unit={editingKpi.unit}
          min={editingKpi.min}
          max={editingKpi.max}
          onClose={() => setEditingKpi(null)}
          onSave={(val) => handleSaveKpi(editingKpi, val)}
        />
      )}

      {/* Edit Chart Target Dialog */}
      <EditTargetDialog
        open={editTargetOpen}
        currentTarget={mealsPerHourData[0]?.target ?? 45}
        onClose={() => setEditTargetOpen(false)}
        onSave={handleSaveTarget}
      />
    </div>
  );
}
