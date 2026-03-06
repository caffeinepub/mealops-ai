import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Truck,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type DeliveryStatus,
  type Ward,
  type WardDelivery,
  wardDeliveries as initialDeliveries,
} from "../data/mockData";

// ─── Config ────────────────────────────────────────────────────────────────────

const deliveryStatusConfig: Record<
  DeliveryStatus,
  {
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }
> = {
  Delivered: {
    badge: "bg-status-ok/15 text-status-ok border-status-ok/30",
    icon: CheckCircle2,
    label: "Delivered",
  },
  "In Transit": {
    badge: "bg-primary/15 text-primary border-primary/30",
    icon: Truck,
    label: "In Transit",
  },
  Delayed: {
    badge:
      "bg-status-critical/15 text-status-critical border-status-critical/30",
    icon: AlertTriangle,
    label: "Delayed",
  },
  Pending: {
    badge: "bg-muted text-muted-foreground border-border",
    icon: Clock,
    label: "Pending",
  },
};

const ALL_WARDS: Ward[] = [
  "ICU",
  "Ward A",
  "Ward B",
  "Pediatrics",
  "Cardiology",
  "Oncology",
  "Orthopedics",
  "Neurology",
];

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: "teal" | "green" | "amber" | "red";
}) {
  const colorMap = {
    teal: "text-primary",
    green: "text-status-ok",
    amber: "text-chart-2",
    red: "text-status-critical",
  };

  return (
    <div className="p-3 rounded-lg border border-border bg-card">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className={cn("text-2xl font-bold font-mono mt-1", colorMap[color])}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Ward Detail Modal ────────────────────────────────────────────────────────

function WardDetailModal({
  delivery,
  onClose,
}: {
  delivery: WardDelivery;
  onClose: () => void;
}) {
  const cfg = deliveryStatusConfig[delivery.status];
  const StatusIcon = cfg.icon;

  return (
    <DialogContent
      data-ocid="delivery.detail.dialog"
      className="max-w-lg bg-card border-border"
    >
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-base font-bold">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {delivery.ward}
            </div>
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              data-ocid="delivery.detail.close_button"
              onClick={onClose}
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-accent/30 text-center">
            <p className="text-[9px] font-mono text-muted-foreground uppercase">
              Cart
            </p>
            <p className="text-xs font-mono font-bold text-foreground mt-0.5">
              {delivery.assignedCart}
            </p>
          </div>
          <div className="p-2 rounded bg-accent/30 text-center">
            <p className="text-[9px] font-mono text-muted-foreground uppercase">
              Scheduled
            </p>
            <p className="text-xs font-mono font-bold text-foreground mt-0.5">
              {delivery.scheduledTime}
            </p>
          </div>
          <div className="p-2 rounded bg-accent/30 text-center">
            <p className="text-[9px] font-mono text-muted-foreground uppercase">
              {delivery.status === "Delivered" ? "Delivered" : "ETA"}
            </p>
            <p
              className={cn(
                "text-xs font-mono font-bold mt-0.5",
                delivery.status === "Delayed"
                  ? "text-status-critical"
                  : "text-foreground",
              )}
            >
              {delivery.actualTime || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusIcon
            className={cn(
              "w-4 h-4",
              delivery.status === "Delivered"
                ? "text-status-ok"
                : delivery.status === "In Transit"
                  ? "text-primary"
                  : delivery.status === "Delayed"
                    ? "text-status-critical"
                    : "text-muted-foreground",
            )}
          />
          <span
            className={cn(
              "text-sm font-semibold px-2 py-0.5 rounded border",
              cfg.badge,
            )}
          >
            {delivery.status}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {delivery.mealsCount} meals
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <h4 className="text-xs font-semibold text-foreground">
              Patient Deliveries
            </h4>
          </div>
          <div className="space-y-1.5">
            {delivery.patients.map((patient) => (
              <div
                key={patient}
                className="flex items-center gap-2 p-2 rounded bg-accent/20 border border-border/30"
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    delivery.status === "Delivered"
                      ? "bg-status-ok"
                      : delivery.status === "In Transit"
                        ? "bg-primary"
                        : delivery.status === "Delayed"
                          ? "bg-status-critical"
                          : "bg-muted-foreground",
                  )}
                />
                <span className="text-xs text-foreground/90">{patient}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

// ─── Add Delivery Dialog ──────────────────────────────────────────────────────

interface AddDeliveryForm {
  ward: Ward;
  cartId: string;
  scheduledTime: string;
  actualTime: string;
  mealsCount: string;
  status: DeliveryStatus;
}

const defaultDeliveryForm: AddDeliveryForm = {
  ward: "ICU",
  cartId: "",
  scheduledTime: "",
  actualTime: "",
  mealsCount: "",
  status: "Pending",
};

function generateDeliveryId(list: WardDelivery[]): string {
  const nums = list.map((d) => {
    const m = d.id.match(/(\d+)$/);
    return m ? Number.parseInt(m[1], 10) : 0;
  });
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `DEL-${String(next).padStart(3, "0")}`;
}

interface AddDeliveryDialogProps {
  open: boolean;
  deliveries: WardDelivery[];
  onClose: () => void;
  onAdd: (delivery: WardDelivery) => void;
}

function AddDeliveryDialog({
  open,
  deliveries,
  onClose,
  onAdd,
}: AddDeliveryDialogProps) {
  const [form, setForm] = useState<AddDeliveryForm>(defaultDeliveryForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm(defaultDeliveryForm);
      setErrors({});
      onClose();
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.cartId.trim()) e.cartId = "Cart ID is required";
    if (!form.scheduledTime.trim())
      e.scheduledTime = "Scheduled time is required";
    if (
      !form.mealsCount ||
      Number.isNaN(Number(form.mealsCount)) ||
      Number(form.mealsCount) < 0
    )
      e.mealsCount = "Valid meal count required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newDelivery: WardDelivery = {
      id: generateDeliveryId(deliveries),
      ward: form.ward,
      assignedCart: form.cartId.trim(),
      scheduledTime: form.scheduledTime.trim(),
      actualTime: form.actualTime.trim(),
      mealsCount: Number(form.mealsCount),
      status: form.status,
      patients: [],
    };
    onAdd(newDelivery);
    toast.success(`Delivery to ${newDelivery.ward} added`, {
      description: `Cart ${newDelivery.assignedCart} · ${newDelivery.scheduledTime}`,
    });
    setForm(defaultDeliveryForm);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="add_delivery.dialog"
        className="max-w-md bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Add Delivery</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="del-ward" className="text-xs font-medium">
              Ward
            </Label>
            <Select
              value={form.ward}
              onValueChange={(v) => setForm((p) => ({ ...p, ward: v as Ward }))}
            >
              <SelectTrigger
                id="del-ward"
                data-ocid="add_delivery.ward.select"
                className="h-8 text-xs bg-muted/50 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_WARDS.map((w) => (
                  <SelectItem key={w} value={w} className="text-xs">
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="del-cart" className="text-xs font-medium">
              Cart ID <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="del-cart"
              data-ocid="add_delivery.cart.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border font-mono",
                errors.cartId && "border-status-critical",
              )}
              placeholder="e.g. MC-007"
              value={form.cartId}
              onChange={(e) => {
                setForm((p) => ({ ...p, cartId: e.target.value }));
                if (errors.cartId) setErrors((p) => ({ ...p, cartId: "" }));
              }}
            />
            {errors.cartId && (
              <p className="text-[10px] text-status-critical">
                {errors.cartId}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="del-meals" className="text-xs font-medium">
              Meals Count <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="del-meals"
              type="number"
              min={0}
              data-ocid="add_delivery.meals.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border font-mono",
                errors.mealsCount && "border-status-critical",
              )}
              placeholder="0"
              value={form.mealsCount}
              onChange={(e) => {
                setForm((p) => ({ ...p, mealsCount: e.target.value }));
                if (errors.mealsCount)
                  setErrors((p) => ({ ...p, mealsCount: "" }));
              }}
            />
            {errors.mealsCount && (
              <p className="text-[10px] text-status-critical">
                {errors.mealsCount}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="del-sched" className="text-xs font-medium">
              Scheduled Time <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="del-sched"
              data-ocid="add_delivery.scheduled.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border font-mono",
                errors.scheduledTime && "border-status-critical",
              )}
              placeholder="e.g. 12:00"
              value={form.scheduledTime}
              onChange={(e) => {
                setForm((p) => ({ ...p, scheduledTime: e.target.value }));
                if (errors.scheduledTime)
                  setErrors((p) => ({ ...p, scheduledTime: "" }));
              }}
            />
            {errors.scheduledTime && (
              <p className="text-[10px] text-status-critical">
                {errors.scheduledTime}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="del-actual" className="text-xs font-medium">
              Actual / ETA{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="del-actual"
              className="h-8 text-xs bg-muted/50 border-border font-mono"
              placeholder="e.g. 12:10"
              value={form.actualTime}
              onChange={(e) =>
                setForm((p) => ({ ...p, actualTime: e.target.value }))
              }
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="del-status" className="text-xs font-medium">
              Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, status: v as DeliveryStatus }))
              }
            >
              <SelectTrigger
                id="del-status"
                data-ocid="add_delivery.status.select"
                className="h-8 text-xs bg-muted/50 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    "Pending",
                    "In Transit",
                    "Delivered",
                    "Delayed",
                  ] as DeliveryStatus[]
                ).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            data-ocid="add_delivery.cancel_button"
            className="text-xs border-border"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            data-ocid="add_delivery.submit_button"
            className="text-xs"
            onClick={handleSubmit}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Delivery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Live Cart Tracker ────────────────────────────────────────────────────────

interface CartTrackProps {
  cartId: string;
  ward: string;
  status: DeliveryStatus;
  mealsCount: number;
}

function CartTrack({ cartId, ward, status, mealsCount }: CartTrackProps) {
  const isDelivered = status === "Delivered";
  const isDelayed = status === "Delayed";
  const isInTransit = status === "In Transit";

  const dotPosition = isDelivered
    ? "95%"
    : isInTransit
      ? "50%"
      : isDelayed
        ? "45%"
        : "5%";

  const dotColor = isDelivered
    ? "bg-status-ok"
    : isDelayed
      ? "bg-status-critical"
      : isInTransit
        ? "bg-primary"
        : "bg-muted-foreground";

  const trackColor = isDelivered
    ? "bg-status-ok/30"
    : isDelayed
      ? "bg-status-critical/30"
      : isInTransit
        ? "bg-primary/30"
        : "bg-muted/50";

  const filledWidth = isDelivered
    ? "100%"
    : isInTransit
      ? "50%"
      : isDelayed
        ? "45%"
        : "0%";

  const filledColor = isDelivered
    ? "bg-status-ok/50"
    : isDelayed
      ? "bg-status-critical/40"
      : isInTransit
        ? "bg-primary/40"
        : "bg-transparent";

  const cfg = deliveryStatusConfig[status];
  const StatusIcon = cfg.icon;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/60 hover:bg-card transition-colors">
      {/* Cart info */}
      <div className="w-20 shrink-0">
        <p className="text-xs font-mono font-bold text-foreground">{cartId}</p>
        <p className="text-[10px] text-muted-foreground truncate">{ward}</p>
      </div>

      {/* Track */}
      <div className="flex-1 flex items-center gap-2">
        {/* Kitchen icon */}
        <div className="shrink-0 flex flex-col items-center gap-0.5">
          <UtensilsCrossed className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[8px] font-mono text-muted-foreground/60">
            KITCHEN
          </span>
        </div>

        {/* Track bar */}
        <div className="flex-1 relative">
          {/* Background track */}
          <div className={cn("h-1.5 w-full rounded-full", trackColor)} />
          {/* Filled portion */}
          <div
            className={cn(
              "absolute top-0 left-0 h-1.5 rounded-full transition-all duration-700",
              filledColor,
            )}
            style={{ width: filledWidth }}
          />
          {/* Moving dot */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-background shadow-lg transition-all duration-700 z-10",
              dotColor,
              isInTransit && "animate-pulse",
              isDelayed && "animate-pulse",
            )}
            style={{ left: dotPosition }}
          />
          {/* Delivered checkmark overlay */}
          {isDelivered && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
              style={{ left: "95%" }}
            >
              <CheckCircle2 className="w-4 h-4 text-status-ok drop-shadow" />
            </div>
          )}
        </div>

        {/* Ward icon */}
        <div className="shrink-0 flex flex-col items-center gap-0.5">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[8px] font-mono text-muted-foreground/60 truncate max-w-12 text-center">
            {ward.toUpperCase().slice(0, 6)}
          </span>
        </div>
      </div>

      {/* Status + meals */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <StatusIcon
            className={cn(
              "w-3 h-3",
              isDelivered
                ? "text-status-ok"
                : isDelayed
                  ? "text-status-critical"
                  : isInTransit
                    ? "text-primary"
                    : "text-muted-foreground",
            )}
          />
          <span
            className={cn(
              "text-[10px] font-mono px-1.5 py-0.5 rounded border",
              cfg.badge,
            )}
          >
            {status}
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {mealsCount} meals
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function DeliveryTrackingPage() {
  const [deliveries, setDeliveries] =
    useState<WardDelivery[]>(initialDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<WardDelivery | null>(
    null,
  );
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WardDelivery | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deliveredCount = deliveries.filter(
    (d) => d.status === "Delivered",
  ).length;
  const inTransitCount = deliveries.filter(
    (d) => d.status === "In Transit",
  ).length;
  const delayedCount = deliveries.filter((d) => d.status === "Delayed").length;
  const pendingCount = deliveries.filter((d) => d.status === "Pending").length;
  const deliveredPct =
    deliveries.length > 0
      ? Math.round((deliveredCount / deliveries.length) * 100)
      : 0;

  // Carts visible in Live Tracker — all except "Delivered" hidden ones
  const trackedCarts = deliveries.filter(
    (d) =>
      d.status === "In Transit" ||
      d.status === "Pending" ||
      d.status === "Delayed" ||
      d.status === "Delivered",
  );

  return (
    <div
      data-ocid="delivery_tracking.page"
      className="p-4 md:p-6 space-y-5 max-w-screen-2xl mx-auto"
    >
      <div>
        <h2 className="text-base font-bold text-foreground">
          Delivery Tracking
        </h2>
        <p className="text-xs text-muted-foreground">
          Real-time ward meal delivery status
        </p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          label="Wards"
          value={deliveries.length}
          sub="Total wards tracked"
          color="teal"
        />
        <SummaryCard
          label="Delivered"
          value={`${deliveredPct}%`}
          sub={`${deliveredCount} of ${deliveries.length} wards`}
          color="green"
        />
        <SummaryCard
          label="In Transit"
          value={inTransitCount}
          sub="Currently en route"
          color="amber"
        />
        <SummaryCard
          label="Delayed"
          value={delayedCount}
          sub={
            pendingCount > 0 ? `${pendingCount} still pending` : "On schedule"
          }
          color="red"
        />
      </div>

      {/* Table header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Ward Deliveries
        </h3>
        <Button
          size="sm"
          data-ocid="delivery_tracking.open_modal_button"
          className="h-7 text-xs gap-1"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="w-3 h-3" />
          Add Delivery
        </Button>
      </div>

      {/* Delivery table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <ScrollArea>
          <Table data-ocid="delivery_tracking.table">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] font-mono text-muted-foreground w-8" />
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Ward
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden sm:table-cell">
                  Cart
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden md:table-cell">
                  Scheduled
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden md:table-cell">
                  Actual / ETA
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden sm:table-cell">
                  Meals
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground w-24">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.length === 0 && (
                <TableRow data-ocid="delivery_tracking.empty_state">
                  <TableCell colSpan={8} className="text-center py-10">
                    <p className="text-sm text-muted-foreground">
                      No deliveries tracked yet
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {deliveries.map((delivery, idx) => {
                const cfg = deliveryStatusConfig[delivery.status];
                const StatusIcon = cfg.icon;
                const isExpanded = expandedRows.has(delivery.id);

                return (
                  <>
                    <TableRow
                      key={delivery.id}
                      data-ocid={`delivery_tracking.row.${idx + 1}`}
                      className={cn(
                        "border-border/50 hover:bg-accent/20 transition-colors cursor-pointer",
                        delivery.status === "Delayed" && "bg-status-critical/5",
                      )}
                      onClick={() => toggleRow(delivery.id)}
                    >
                      <TableCell className="py-3 pl-3">
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-xs font-semibold text-foreground">
                            {delivery.ward}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 hidden sm:table-cell">
                        <span className="text-xs font-mono text-muted-foreground">
                          {delivery.assignedCart}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">
                        <span className="text-xs font-mono text-muted-foreground">
                          {delivery.scheduledTime}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">
                        <span
                          className={cn(
                            "text-xs font-mono",
                            delivery.status === "Delayed"
                              ? "text-status-critical"
                              : delivery.actualTime
                                ? "text-status-ok"
                                : "text-muted-foreground/50",
                          )}
                        >
                          {delivery.actualTime || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 hidden sm:table-cell">
                        <span className="text-xs font-mono text-foreground">
                          {delivery.mealsCount}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon
                            className={cn(
                              "w-3 h-3 shrink-0",
                              delivery.status === "Delivered"
                                ? "text-status-ok"
                                : delivery.status === "In Transit"
                                  ? "text-primary animate-pulse-slow"
                                  : delivery.status === "Delayed"
                                    ? "text-status-critical"
                                    : "text-muted-foreground",
                            )}
                          />
                          <span
                            className={cn(
                              "text-[10px] font-mono px-2 py-0.5 rounded border",
                              cfg.badge,
                            )}
                          >
                            {delivery.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDelivery(delivery);
                            }}
                            data-ocid={`delivery_tracking.row.${idx + 1}.button`}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-ocid={`delivery_tracking.delete_button.${idx + 1}`}
                            className="h-6 w-6 text-muted-foreground/40 hover:text-status-critical hover:bg-status-critical/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(delivery);
                            }}
                            aria-label={`Remove delivery ${delivery.id}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded row */}
                    {isExpanded && (
                      <TableRow
                        key={`${delivery.id}-expanded`}
                        className="border-border/30 hover:bg-transparent"
                      >
                        <TableCell colSpan={8} className="py-0">
                          <div className="px-4 py-3 bg-accent/20 border-t border-border/30">
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                              Patient List
                            </p>
                            {delivery.patients.length === 0 ? (
                              <span className="text-[10px] text-muted-foreground/50">
                                No patients listed
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {delivery.patients.map((p) => (
                                  <span
                                    key={p}
                                    className="text-[10px] px-2 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border/50"
                                  >
                                    {p}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3">
        {(
          Object.entries(deliveryStatusConfig) as [
            DeliveryStatus,
            (typeof deliveryStatusConfig)[DeliveryStatus],
          ][]
        ).map(([status, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={status} className="flex items-center gap-1.5">
              <Icon
                className={cn(
                  "w-3 h-3",
                  status === "Delivered"
                    ? "text-status-ok"
                    : status === "In Transit"
                      ? "text-primary"
                      : status === "Delayed"
                        ? "text-status-critical"
                        : "text-muted-foreground",
                )}
              />
              <span className="text-[11px] text-muted-foreground">
                {status}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Live Cart Movement ── */}
      {trackedCarts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Live Cart Movement
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] font-mono text-primary border-primary/30 bg-primary/5"
              >
                LIVE
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {trackedCarts.length} cart{trackedCarts.length !== 1 ? "s" : ""}{" "}
              tracked
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card/40 p-3 space-y-2">
            {/* Legend */}
            <div className="flex flex-wrap gap-3 pb-2 border-b border-border/40">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  Pending
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] text-muted-foreground">
                  In Transit
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-status-critical animate-pulse" />
                <span className="text-[10px] text-muted-foreground">
                  Delayed
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-status-ok" />
                <span className="text-[10px] text-muted-foreground">
                  Delivered
                </span>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <UtensilsCrossed className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  Kitchen → Ward
                </span>
                <MapPin className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>

            {/* Cart tracks */}
            <div className="space-y-2">
              {trackedCarts.map((d) => (
                <CartTrack
                  key={d.id}
                  cartId={d.assignedCart}
                  ward={d.ward}
                  status={d.status}
                  mealsCount={d.mealsCount}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ward Detail Modal */}
      <Dialog
        open={selectedDelivery !== null}
        onOpenChange={(open) => !open && setSelectedDelivery(null)}
      >
        {selectedDelivery && (
          <WardDetailModal
            delivery={selectedDelivery}
            onClose={() => setSelectedDelivery(null)}
          />
        )}
      </Dialog>

      {/* Add Delivery Dialog */}
      <AddDeliveryDialog
        open={addOpen}
        deliveries={deliveries}
        onClose={() => setAddOpen(false)}
        onAdd={(d) => setDeliveries((prev) => [...prev, d])}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent
          data-ocid="delivery.delete.dialog"
          className="bg-card border-border max-w-sm"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold">
              Remove Delivery
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Remove the delivery for{" "}
              <span className="text-foreground font-semibold">
                {deleteTarget?.ward}
              </span>{" "}
              (Cart{" "}
              <span className="text-foreground font-mono">
                {deleteTarget?.assignedCart}
              </span>
              )? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              data-ocid="delivery.delete.cancel_button"
              className="h-8 text-xs border-border"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="delivery.delete.confirm_button"
              className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  setDeliveries((prev) =>
                    prev.filter((d) => d.id !== deleteTarget.id),
                  );
                  toast.success(`Delivery to ${deleteTarget.ward} removed`);
                  setDeleteTarget(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
