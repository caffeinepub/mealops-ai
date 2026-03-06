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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Package,
  Plus,
  RotateCcw,
  ShoppingCart,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type CartStatus,
  type Equipment,
  type EquipmentStatus,
  type Ingredient,
  type IngredientStatus,
  type MealCart,
  type Shift,
  type Staff,
  type StaffRole,
  equipment as initialEquipment,
  ingredients as initialIngredients,
  mealCarts as initialMealCarts,
  staff as initialStaff,
} from "../data/mockData";

// ─── Status configs ────────────────────────────────────────────────────────────

const ingredientStatusConfig: Record<
  IngredientStatus,
  { badge: string; progress: string }
> = {
  OK: {
    badge: "bg-status-ok/15 text-status-ok border-status-ok/30",
    progress: "bg-status-ok",
  },
  Low: {
    badge: "bg-status-warning/15 text-status-warning border-status-warning/30",
    progress: "bg-status-warning",
  },
  Critical: {
    badge:
      "bg-status-critical/15 text-status-critical border-status-critical/30",
    progress: "bg-status-critical",
  },
};

const equipmentStatusConfig: Record<EquipmentStatus, string> = {
  Active: "bg-status-ok/15 text-status-ok border-status-ok/30",
  Idle: "bg-status-idle/15 text-status-idle border-status-idle/30",
  Maintenance:
    "bg-status-warning/15 text-status-warning border-status-warning/30",
};

const cartStatusConfig: Record<CartStatus, string> = {
  Loading: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  "In Transit": "bg-primary/15 text-primary border-primary/30",
  Returned: "bg-status-ok/15 text-status-ok border-status-ok/30",
  Available: "bg-muted text-muted-foreground border-border",
};

const availabilityConfig: Record<string, string> = {
  Available: "text-status-ok",
  Busy: "text-chart-2",
  "On Break": "text-status-warning",
  "Off Duty": "text-muted-foreground",
};

const shiftColors: Record<string, string> = {
  Morning: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  Evening: "bg-chart-4/15 text-chart-4 border-chart-4/20",
  Night: "bg-primary/15 text-primary border-primary/20",
};

// ─── Helper ────────────────────────────────────────────────────────────────────

function makeId(prefix: string, list: { id: string }[]): string {
  const nums = list.map((x) => {
    const m = x.id.match(/(\d+)$/);
    return m ? Number.parseInt(m[1], 10) : 0;
  });
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

// ─── Confirm Delete Dialog ─────────────────────────────────────────────────────

interface ConfirmDeleteProps {
  open: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDeleteDialog({
  open,
  itemName,
  onConfirm,
  onCancel,
}: ConfirmDeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent
        data-ocid="resource.delete.dialog"
        className="bg-card border-border max-w-sm"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm font-bold">
            Confirm Removal
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Remove{" "}
            <span className="text-foreground font-semibold">{itemName}</span>?
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="resource.delete.cancel_button"
            className="h-8 text-xs border-border"
            onClick={onCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="resource.delete.confirm_button"
            className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── INGREDIENTS TAB ──────────────────────────────────────────────────────────

interface AddIngredientForm {
  name: string;
  category: string;
  currentStock: string;
  unit: string;
  parLevel: string;
  maxLevel: string;
  lastRestocked: string;
  status: IngredientStatus;
}

const defaultIngredientForm: AddIngredientForm = {
  name: "",
  category: "",
  currentStock: "",
  unit: "kg",
  parLevel: "",
  maxLevel: "",
  lastRestocked: new Date().toISOString().slice(0, 10),
  status: "OK",
};

function AddIngredientDialog({
  open,
  ingredients,
  onClose,
  onAdd,
}: {
  open: boolean;
  ingredients: Ingredient[];
  onClose: () => void;
  onAdd: (item: Ingredient) => void;
}) {
  const [form, setForm] = useState<AddIngredientForm>(defaultIngredientForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm(defaultIngredientForm);
      setErrors({});
      onClose();
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.currentStock || Number.isNaN(Number(form.currentStock)))
      e.currentStock = "Valid number required";
    if (!form.parLevel || Number.isNaN(Number(form.parLevel)))
      e.parLevel = "Valid number required";
    if (!form.maxLevel || Number.isNaN(Number(form.maxLevel)))
      e.maxLevel = "Valid number required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newItem: Ingredient = {
      id: makeId("ING", ingredients),
      name: form.name.trim(),
      category: form.category.trim(),
      currentStock: Number(form.currentStock),
      unit: form.unit.trim() || "kg",
      parLevel: Number(form.parLevel),
      maxLevel: Number(form.maxLevel),
      status: form.status,
      lastRestocked: form.lastRestocked,
    };
    onAdd(newItem);
    toast.success(`${newItem.name} added to inventory`);
    setForm(defaultIngredientForm);
    setErrors({});
    onClose();
  };

  const field = (
    id: string,
    label: string,
    required: boolean,
    child: React.ReactNode,
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
        {required && <span className="text-status-critical ml-0.5">*</span>}
      </Label>
      {child}
      {errors[id] && (
        <p className="text-[10px] text-status-critical">{errors[id]}</p>
      )}
    </div>
  );

  const inp = (id: keyof AddIngredientForm, placeholder?: string) => (
    <Input
      id={id}
      className={cn(
        "h-8 text-xs bg-muted/50 border-border",
        errors[id] && "border-status-critical",
      )}
      placeholder={placeholder}
      value={form[id]}
      onChange={(e) => {
        setForm((p) => ({ ...p, [id]: e.target.value }));
        if (errors[id]) setErrors((p) => ({ ...p, [id]: "" }));
      }}
    />
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="add_ingredient.dialog"
        className="max-w-md bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">
            Add Ingredient
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="col-span-2">
            {field(
              "name",
              "Ingredient Name",
              true,
              inp("name", "e.g. Chicken Breast"),
            )}
          </div>
          {field("category", "Category", true, inp("category", "e.g. Protein"))}
          {field(
            "unit",
            "Unit",
            false,
            <Input
              id="unit"
              className="h-8 text-xs bg-muted/50 border-border"
              placeholder="e.g. kg"
              value={form.unit}
              onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
            />,
          )}
          {field("currentStock", "Stock Level", true, inp("currentStock", "0"))}
          {field("parLevel", "Par Level", true, inp("parLevel", "0"))}
          {field("maxLevel", "Max Level", true, inp("maxLevel", "0"))}
          {field(
            "lastRestocked",
            "Last Restocked",
            false,
            <Input
              id="lastRestocked"
              type="date"
              className="h-8 text-xs bg-muted/50 border-border"
              value={form.lastRestocked}
              onChange={(e) =>
                setForm((p) => ({ ...p, lastRestocked: e.target.value }))
              }
            />,
          )}
          {field(
            "status",
            "Status",
            true,
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, status: v as IngredientStatus }))
              }
            >
              <SelectTrigger
                id="status"
                data-ocid="add_ingredient.status.select"
                className="h-8 text-xs bg-muted/50 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["OK", "Low", "Critical"] as IngredientStatus[]).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>,
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            data-ocid="add_ingredient.cancel_button"
            className="text-xs border-border"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            data-ocid="add_ingredient.submit_button"
            className="text-xs"
            onClick={handleSubmit}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Ingredient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function IngredientsTab({
  ingredients,
  onAdd,
  onRemove,
}: {
  ingredients: Ingredient[];
  onAdd: (item: Ingredient) => void;
  onRemove: (id: string) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Ingredient | null>(null);

  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <Button
          size="sm"
          data-ocid="ingredients.open_modal_button"
          className="h-7 text-xs gap-1"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="w-3 h-3" />
          Add Ingredient
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <ScrollArea>
          <Table data-ocid="ingredients.table">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Ingredient
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Stock Level
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden md:table-cell">
                  Par Level
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden lg:table-cell">
                  Last Restocked
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground w-28">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.length === 0 && (
                <TableRow data-ocid="ingredients.empty_state">
                  <TableCell colSpan={7} className="text-center py-10">
                    <p className="text-sm text-muted-foreground">
                      No ingredients added yet
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {ingredients.map((ing, idx) => {
                const stockPct = Math.min(
                  100,
                  (ing.currentStock / ing.maxLevel) * 100,
                );
                const cfg = ingredientStatusConfig[ing.status];
                return (
                  <TableRow
                    key={ing.id}
                    data-ocid={`ingredients.row.${idx + 1}`}
                    className="border-border/50 hover:bg-accent/20 transition-colors"
                  >
                    <TableCell className="py-3">
                      <p className="text-xs font-medium text-foreground">
                        {ing.name}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {ing.currentStock} {ing.unit}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {ing.category}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="space-y-1 min-w-[80px]">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              cfg.progress,
                            )}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          {Math.round(stockPct)}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 hidden md:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">
                        {ing.parLevel} {ing.unit}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={cn(
                          "text-[10px] font-mono px-2 py-0.5 rounded border",
                          cfg.badge,
                        )}
                      >
                        {ing.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 hidden lg:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">
                        {ing.lastRestocked}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5">
                        {ing.status !== "OK" && (
                          <Button
                            data-ocid={`ingredients.reorder_button.${idx + 1}`}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-6 px-2 text-[10px] font-mono border",
                              ing.status === "Critical"
                                ? "border-status-critical/40 text-status-critical hover:bg-status-critical/10"
                                : "border-status-warning/40 text-status-warning hover:bg-status-warning/10",
                            )}
                            onClick={() =>
                              toast.success(`Reorder triggered for ${ing.name}`)
                            }
                          >
                            <RotateCcw className="w-2.5 h-2.5 mr-1" />
                            Reorder
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          data-ocid={`ingredients.delete_button.${idx + 1}`}
                          className="h-6 w-6 text-muted-foreground/40 hover:text-status-critical hover:bg-status-critical/10"
                          onClick={() => setDeleteTarget(ing)}
                          aria-label={`Remove ${ing.name}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <AddIngredientDialog
        open={addOpen}
        ingredients={ingredients}
        onClose={() => setAddOpen(false)}
        onAdd={onAdd}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={deleteTarget?.name ?? ""}
        onConfirm={() => {
          if (deleteTarget) {
            onRemove(deleteTarget.id);
            toast.success(`${deleteTarget.name} removed from inventory`);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── STAFF TAB ─────────────────────────────────────────────────────────────────

interface AddStaffForm {
  name: string;
  role: StaffRole;
  shift: Shift;
  currentAssignment: string;
  availability: Staff["availability"];
}

const defaultStaffForm: AddStaffForm = {
  name: "",
  role: "Chef",
  shift: "Morning",
  currentAssignment: "",
  availability: "Available",
};

const STAFF_ROLES: StaffRole[] = [
  "Head Chef",
  "Chef",
  "Dietitian",
  "Porter",
  "Supervisor",
  "Kitchen Assistant",
];

const STAFF_AVAILABILITY: Staff["availability"][] = [
  "Available",
  "Busy",
  "On Break",
  "Off Duty",
];

function AddStaffDialog({
  open,
  staff,
  onClose,
  onAdd,
}: {
  open: boolean;
  staff: Staff[];
  onClose: () => void;
  onAdd: (item: Staff) => void;
}) {
  const [form, setForm] = useState<AddStaffForm>(defaultStaffForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm(defaultStaffForm);
      setErrors({});
      onClose();
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.currentAssignment.trim())
      e.currentAssignment = "Assignment is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newItem: Staff = {
      id: makeId("STF", staff),
      name: form.name.trim(),
      role: form.role,
      shift: form.shift,
      currentAssignment: form.currentAssignment.trim(),
      availability: form.availability,
      avatar: getInitials(form.name),
    };
    onAdd(newItem);
    toast.success(`${newItem.name} added to staff`);
    setForm(defaultStaffForm);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="add_staff.dialog"
        className="max-w-md bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">
            Add Staff Member
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="staff-name" className="text-xs font-medium">
              Full Name <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="staff-name"
              data-ocid="add_staff.name.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.name && "border-status-critical",
              )}
              placeholder="e.g. Sarah Mitchell"
              value={form.name}
              onChange={(e) => {
                setForm((p) => ({ ...p, name: e.target.value }));
                if (errors.name) setErrors((p) => ({ ...p, name: "" }));
              }}
            />
            {errors.name && (
              <p className="text-[10px] text-status-critical">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="staff-role" className="text-xs font-medium">
                Role
              </Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, role: v as StaffRole }))
                }
              >
                <SelectTrigger
                  id="staff-role"
                  data-ocid="add_staff.role.select"
                  className="h-8 text-xs bg-muted/50 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="staff-shift" className="text-xs font-medium">
                Shift
              </Label>
              <Select
                value={form.shift}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, shift: v as Shift }))
                }
              >
                <SelectTrigger
                  id="staff-shift"
                  data-ocid="add_staff.shift.select"
                  className="h-8 text-xs bg-muted/50 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Morning", "Evening", "Night"] as Shift[]).map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="staff-assignment" className="text-xs font-medium">
              Current Assignment <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="staff-assignment"
              data-ocid="add_staff.assignment.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.currentAssignment && "border-status-critical",
              )}
              placeholder="e.g. Cooking Station – lunch batch"
              value={form.currentAssignment}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  currentAssignment: e.target.value,
                }));
                if (errors.currentAssignment)
                  setErrors((p) => ({ ...p, currentAssignment: "" }));
              }}
            />
            {errors.currentAssignment && (
              <p className="text-[10px] text-status-critical">
                {errors.currentAssignment}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="staff-avail" className="text-xs font-medium">
              Availability
            </Label>
            <Select
              value={form.availability}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  availability: v as Staff["availability"],
                }))
              }
            >
              <SelectTrigger
                id="staff-avail"
                data-ocid="add_staff.availability.select"
                className="h-8 text-xs bg-muted/50 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAFF_AVAILABILITY.map((a) => (
                  <SelectItem key={a} value={a} className="text-xs">
                    {a}
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
            data-ocid="add_staff.cancel_button"
            className="text-xs border-border"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            data-ocid="add_staff.submit_button"
            className="text-xs"
            onClick={handleSubmit}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StaffTab({
  staff,
  onAdd,
  onRemove,
}: {
  staff: Staff[];
  onAdd: (item: Staff) => void;
  onRemove: (id: string) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);

  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <Button
          size="sm"
          data-ocid="staff.open_modal_button"
          className="h-7 text-xs gap-1"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="w-3 h-3" />
          Add Staff Member
        </Button>
      </div>

      {staff.length === 0 && (
        <div
          data-ocid="staff.empty_state"
          className="py-16 text-center text-muted-foreground text-sm"
        >
          No staff members. Add your first team member above.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {staff.map((member, idx) => (
          <div
            key={member.id}
            data-ocid={`staff.item.${idx + 1}`}
            className="p-4 rounded-lg border border-border bg-card space-y-3 hover:border-border/80 transition-colors group relative"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary font-mono">
                  {member.avatar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {member.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {member.role}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    availabilityConfig[member.availability],
                  )}
                >
                  {member.availability}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  data-ocid={`staff.delete_button.${idx + 1}`}
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/40 hover:text-status-critical hover:bg-status-critical/10"
                  onClick={() => setDeleteTarget(member)}
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Shift</span>
                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded border",
                    shiftColors[member.shift],
                  )}
                >
                  {member.shift}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] text-muted-foreground shrink-0">
                  Assignment
                </span>
                <span className="text-[10px] text-foreground/80 text-right leading-snug">
                  {member.currentAssignment}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddStaffDialog
        open={addOpen}
        staff={staff}
        onClose={() => setAddOpen(false)}
        onAdd={onAdd}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={deleteTarget?.name ?? ""}
        onConfirm={() => {
          if (deleteTarget) {
            onRemove(deleteTarget.id);
            toast.success(`${deleteTarget.name} removed from staff`);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── EQUIPMENT TAB ────────────────────────────────────────────────────────────

interface AddEquipmentForm {
  name: string;
  location: string;
  status: EquipmentStatus;
  utilizationPercent: string;
  lastServiced: string;
  nextMaintenance: string;
}

const defaultEquipmentForm: AddEquipmentForm = {
  name: "",
  location: "",
  status: "Active",
  utilizationPercent: "0",
  lastServiced: new Date().toISOString().slice(0, 10),
  nextMaintenance: "",
};

function AddEquipmentDialog({
  open,
  equipment,
  onClose,
  onAdd,
}: {
  open: boolean;
  equipment: Equipment[];
  onClose: () => void;
  onAdd: (item: Equipment) => void;
}) {
  const [form, setForm] = useState<AddEquipmentForm>(defaultEquipmentForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm(defaultEquipmentForm);
      setErrors({});
      onClose();
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.location.trim()) e.location = "Location is required";
    const u = Number(form.utilizationPercent);
    if (Number.isNaN(u) || u < 0 || u > 100)
      e.utilizationPercent = "0–100 required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newItem: Equipment = {
      id: makeId("EQ", equipment),
      name: form.name.trim(),
      location: form.location.trim(),
      status: form.status,
      utilizationPercent: Number(form.utilizationPercent),
      lastServiced: form.lastServiced,
      nextMaintenance: form.nextMaintenance,
    };
    onAdd(newItem);
    toast.success(`${newItem.name} added to equipment`);
    setForm(defaultEquipmentForm);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="add_equipment.dialog"
        className="max-w-md bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Add Equipment</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="eq-name" className="text-xs font-medium">
              Name <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="eq-name"
              data-ocid="add_equipment.name.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.name && "border-status-critical",
              )}
              placeholder="e.g. Combi Oven 3"
              value={form.name}
              onChange={(e) => {
                setForm((p) => ({ ...p, name: e.target.value }));
                if (errors.name) setErrors((p) => ({ ...p, name: "" }));
              }}
            />
            {errors.name && (
              <p className="text-[10px] text-status-critical">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="eq-loc" className="text-xs font-medium">
              Location <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="eq-loc"
              data-ocid="add_equipment.location.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.location && "border-status-critical",
              )}
              placeholder="e.g. Main Kitchen"
              value={form.location}
              onChange={(e) => {
                setForm((p) => ({ ...p, location: e.target.value }));
                if (errors.location) setErrors((p) => ({ ...p, location: "" }));
              }}
            />
            {errors.location && (
              <p className="text-[10px] text-status-critical">
                {errors.location}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="eq-status" className="text-xs font-medium">
              Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, status: v as EquipmentStatus }))
              }
            >
              <SelectTrigger
                id="eq-status"
                data-ocid="add_equipment.status.select"
                className="h-8 text-xs bg-muted/50 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Active", "Idle", "Maintenance"] as EquipmentStatus[]).map(
                  (s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="eq-util" className="text-xs font-medium">
              Utilization %
            </Label>
            <Input
              id="eq-util"
              type="number"
              min={0}
              max={100}
              data-ocid="add_equipment.utilization.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.utilizationPercent && "border-status-critical",
              )}
              placeholder="0"
              value={form.utilizationPercent}
              onChange={(e) => {
                setForm((p) => ({ ...p, utilizationPercent: e.target.value }));
                if (errors.utilizationPercent)
                  setErrors((p) => ({ ...p, utilizationPercent: "" }));
              }}
            />
            {errors.utilizationPercent && (
              <p className="text-[10px] text-status-critical">
                {errors.utilizationPercent}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="eq-serviced" className="text-xs font-medium">
              Last Serviced
            </Label>
            <Input
              id="eq-serviced"
              type="date"
              className="h-8 text-xs bg-muted/50 border-border"
              value={form.lastServiced}
              onChange={(e) =>
                setForm((p) => ({ ...p, lastServiced: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="eq-next" className="text-xs font-medium">
              Next Maintenance
            </Label>
            <Input
              id="eq-next"
              type="date"
              className="h-8 text-xs bg-muted/50 border-border"
              value={form.nextMaintenance}
              onChange={(e) =>
                setForm((p) => ({ ...p, nextMaintenance: e.target.value }))
              }
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            data-ocid="add_equipment.cancel_button"
            className="text-xs border-border"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            data-ocid="add_equipment.submit_button"
            className="text-xs"
            onClick={handleSubmit}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Equipment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EquipmentTab({
  equipment,
  onAdd,
  onRemove,
}: {
  equipment: Equipment[];
  onAdd: (item: Equipment) => void;
  onRemove: (id: string) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);

  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <Button
          size="sm"
          data-ocid="equipment.open_modal_button"
          className="h-7 text-xs gap-1"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="w-3 h-3" />
          Add Equipment
        </Button>
      </div>

      {equipment.length === 0 && (
        <div
          data-ocid="equipment.empty_state"
          className="py-16 text-center text-muted-foreground text-sm"
        >
          No equipment tracked yet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {equipment.map((eq, idx) => {
          const statusCls = equipmentStatusConfig[eq.status];
          return (
            <div
              key={eq.id}
              data-ocid={`equipment.item.${idx + 1}`}
              className={cn(
                "p-4 rounded-lg border bg-card space-y-3 transition-colors group relative",
                eq.status === "Maintenance"
                  ? "border-status-warning/30"
                  : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {eq.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {eq.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded border",
                      statusCls,
                    )}
                  >
                    {eq.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-ocid={`equipment.delete_button.${idx + 1}`}
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/40 hover:text-status-critical hover:bg-status-critical/10"
                    onClick={() => setDeleteTarget(eq)}
                    aria-label={`Remove ${eq.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>UTILIZATION</span>
                  <span className="text-foreground">
                    {eq.utilizationPercent}%
                  </span>
                </div>
                <Progress
                  value={eq.utilizationPercent}
                  className="h-1.5 bg-muted"
                />
              </div>

              <div className="space-y-1 text-[10px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Last Serviced</span>
                  <span className="font-mono">{eq.lastServiced}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Maintenance</span>
                  <span
                    className={cn(
                      "font-mono",
                      eq.status === "Maintenance" ? "text-status-warning" : "",
                    )}
                  >
                    {eq.nextMaintenance || "—"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddEquipmentDialog
        open={addOpen}
        equipment={equipment}
        onClose={() => setAddOpen(false)}
        onAdd={onAdd}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={deleteTarget?.name ?? ""}
        onConfirm={() => {
          if (deleteTarget) {
            onRemove(deleteTarget.id);
            toast.success(`${deleteTarget.name} removed from equipment`);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── MEAL CARTS TAB ───────────────────────────────────────────────────────────

interface AddCartForm {
  assignedWard: string;
  mealsLoaded: string;
  capacity: string;
  departureTime: string;
  returnTime: string;
  assignedPorter: string;
  status: CartStatus;
}

const defaultCartForm: AddCartForm = {
  assignedWard: "",
  mealsLoaded: "0",
  capacity: "20",
  departureTime: "",
  returnTime: "",
  assignedPorter: "",
  status: "Available",
};

function AddCartDialog({
  open,
  carts,
  onClose,
  onAdd,
}: {
  open: boolean;
  carts: MealCart[];
  onClose: () => void;
  onAdd: (item: MealCart) => void;
}) {
  const [form, setForm] = useState<AddCartForm>(defaultCartForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm(defaultCartForm);
      setErrors({});
      onClose();
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.assignedWard.trim()) e.assignedWard = "Ward is required";
    if (
      !form.capacity ||
      Number.isNaN(Number(form.capacity)) ||
      Number(form.capacity) < 1
    )
      e.capacity = "Valid capacity required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newItem: MealCart = {
      id: makeId("MC", carts),
      assignedWard: form.assignedWard.trim(),
      mealsLoaded: Number(form.mealsLoaded) || 0,
      capacity: Number(form.capacity),
      departureTime: form.departureTime,
      returnTime: form.returnTime,
      assignedPorter: form.assignedPorter.trim() || "Unassigned",
      status: form.status,
    };
    onAdd(newItem);
    toast.success(`Cart ${newItem.id} added`);
    setForm(defaultCartForm);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="add_cart.dialog"
        className="max-w-md bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Add Meal Cart</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="cart-ward" className="text-xs font-medium">
              Assigned Ward <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="cart-ward"
              data-ocid="add_cart.ward.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.assignedWard && "border-status-critical",
              )}
              placeholder="e.g. ICU"
              value={form.assignedWard}
              onChange={(e) => {
                setForm((p) => ({ ...p, assignedWard: e.target.value }));
                if (errors.assignedWard)
                  setErrors((p) => ({ ...p, assignedWard: "" }));
              }}
            />
            {errors.assignedWard && (
              <p className="text-[10px] text-status-critical">
                {errors.assignedWard}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cart-loaded" className="text-xs font-medium">
              Meals Loaded
            </Label>
            <Input
              id="cart-loaded"
              type="number"
              min={0}
              className="h-8 text-xs bg-muted/50 border-border"
              placeholder="0"
              value={form.mealsLoaded}
              onChange={(e) =>
                setForm((p) => ({ ...p, mealsLoaded: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cart-cap" className="text-xs font-medium">
              Capacity <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="cart-cap"
              type="number"
              min={1}
              data-ocid="add_cart.capacity.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.capacity && "border-status-critical",
              )}
              placeholder="20"
              value={form.capacity}
              onChange={(e) => {
                setForm((p) => ({ ...p, capacity: e.target.value }));
                if (errors.capacity) setErrors((p) => ({ ...p, capacity: "" }));
              }}
            />
            {errors.capacity && (
              <p className="text-[10px] text-status-critical">
                {errors.capacity}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cart-dep" className="text-xs font-medium">
              Departure Time
            </Label>
            <Input
              id="cart-dep"
              className="h-8 text-xs bg-muted/50 border-border font-mono"
              placeholder="e.g. 12:00"
              value={form.departureTime}
              onChange={(e) =>
                setForm((p) => ({ ...p, departureTime: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cart-ret" className="text-xs font-medium">
              Return Time
            </Label>
            <Input
              id="cart-ret"
              className="h-8 text-xs bg-muted/50 border-border font-mono"
              placeholder="e.g. 12:45"
              value={form.returnTime}
              onChange={(e) =>
                setForm((p) => ({ ...p, returnTime: e.target.value }))
              }
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="cart-porter" className="text-xs font-medium">
              Assigned Porter
            </Label>
            <Input
              id="cart-porter"
              className="h-8 text-xs bg-muted/50 border-border"
              placeholder="e.g. Tom Bradley"
              value={form.assignedPorter}
              onChange={(e) =>
                setForm((p) => ({ ...p, assignedPorter: e.target.value }))
              }
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="cart-status" className="text-xs font-medium">
              Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, status: v as CartStatus }))
              }
            >
              <SelectTrigger
                id="cart-status"
                data-ocid="add_cart.status.select"
                className="h-8 text-xs bg-muted/50 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    "Loading",
                    "In Transit",
                    "Returned",
                    "Available",
                  ] as CartStatus[]
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
            data-ocid="add_cart.cancel_button"
            className="text-xs border-border"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            data-ocid="add_cart.submit_button"
            className="text-xs"
            onClick={handleSubmit}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CartsTab({
  carts,
  onAdd,
  onRemove,
}: {
  carts: MealCart[];
  onAdd: (item: MealCart) => void;
  onRemove: (id: string) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MealCart | null>(null);

  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <Button
          size="sm"
          data-ocid="carts.open_modal_button"
          className="h-7 text-xs gap-1"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="w-3 h-3" />
          Add Cart
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <ScrollArea>
          <Table data-ocid="carts.table">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Cart ID
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Assigned Ward
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Load
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden sm:table-cell">
                  Departure
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden sm:table-cell">
                  Return
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground hidden md:table-cell">
                  Porter
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-[10px] font-mono text-muted-foreground w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.length === 0 && (
                <TableRow data-ocid="carts.empty_state">
                  <TableCell colSpan={8} className="text-center py-10">
                    <p className="text-sm text-muted-foreground">
                      No carts tracked yet
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {carts.map((cart, idx) => {
                const loadPct = Math.round(
                  (cart.mealsLoaded / cart.capacity) * 100,
                );
                return (
                  <TableRow
                    key={cart.id}
                    data-ocid={`carts.row.${idx + 1}`}
                    className="border-border/50 hover:bg-accent/20 transition-colors"
                  >
                    <TableCell className="py-3">
                      <span className="text-xs font-mono font-bold text-foreground">
                        {cart.id}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-xs text-foreground">
                        {cart.assignedWard}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="space-y-1 min-w-[70px]">
                        <p className="text-[10px] font-mono text-muted-foreground">
                          {cart.mealsLoaded}/{cart.capacity}
                        </p>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${loadPct}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 hidden sm:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">
                        {cart.departureTime || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 hidden sm:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">
                        {cart.returnTime || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {cart.assignedPorter}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={cn(
                          "text-[10px] font-mono px-2 py-0.5 rounded border",
                          cartStatusConfig[cart.status],
                        )}
                      >
                        {cart.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        data-ocid={`carts.delete_button.${idx + 1}`}
                        className="h-6 w-6 text-muted-foreground/40 hover:text-status-critical hover:bg-status-critical/10"
                        onClick={() => setDeleteTarget(cart)}
                        aria-label={`Remove cart ${cart.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <AddCartDialog
        open={addOpen}
        carts={carts}
        onClose={() => setAddOpen(false)}
        onAdd={onAdd}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={`Cart ${deleteTarget?.id ?? ""}`}
        onConfirm={() => {
          if (deleteTarget) {
            onRemove(deleteTarget.id);
            toast.success(`Cart ${deleteTarget.id} removed`);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ResourceTrackingPage() {
  const [activeTab, setActiveTab] = useState("ingredients");

  const [ingredients, setIngredients] =
    useState<Ingredient[]>(initialIngredients);
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [equipmentList, setEquipmentList] =
    useState<Equipment[]>(initialEquipment);
  const [cartsList, setCartsList] = useState<MealCart[]>(initialMealCarts);

  const lowStockCount = ingredients.filter(
    (i) => i.status === "Low" || i.status === "Critical",
  ).length;
  const maintenanceCount = equipmentList.filter(
    (e) => e.status === "Maintenance",
  ).length;

  return (
    <div
      data-ocid="resource_tracking.page"
      className="p-4 md:p-6 space-y-4 max-w-screen-2xl mx-auto"
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Resource Tracking
          </h2>
          <p className="text-xs text-muted-foreground">
            Ingredients, staff, equipment, and meal carts
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {lowStockCount > 0 && (
            <Badge className="bg-status-critical/15 text-status-critical border border-status-critical/40 text-xs">
              {lowStockCount} Low Stock
            </Badge>
          )}
          {maintenanceCount > 0 && (
            <Badge className="bg-status-warning/15 text-status-warning border border-status-warning/40 text-xs">
              {maintenanceCount} Maintenance
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 border border-border h-9">
          <TabsTrigger
            value="ingredients"
            data-ocid="resource_tracking.ingredients.tab"
            className="text-xs gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <Package className="w-3.5 h-3.5" />
            Ingredients
            {lowStockCount > 0 && (
              <span className="ml-0.5 text-[9px] font-mono bg-status-critical/20 text-status-critical px-1 rounded">
                {lowStockCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            data-ocid="resource_tracking.staff.tab"
            className="text-xs gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <Users className="w-3.5 h-3.5" />
            Staff
          </TabsTrigger>
          <TabsTrigger
            value="equipment"
            data-ocid="resource_tracking.equipment.tab"
            className="text-xs gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <Wrench className="w-3.5 h-3.5" />
            Equipment
            {maintenanceCount > 0 && (
              <span className="ml-0.5 text-[9px] font-mono bg-status-warning/20 text-status-warning px-1 rounded">
                {maintenanceCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="carts"
            data-ocid="resource_tracking.carts.tab"
            className="text-xs gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Meal Carts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="mt-4">
          <IngredientsTab
            ingredients={ingredients}
            onAdd={(item) => setIngredients((prev) => [...prev, item])}
            onRemove={(id) =>
              setIngredients((prev) => prev.filter((i) => i.id !== id))
            }
          />
        </TabsContent>
        <TabsContent value="staff" className="mt-4">
          <StaffTab
            staff={staffList}
            onAdd={(item) => setStaffList((prev) => [...prev, item])}
            onRemove={(id) =>
              setStaffList((prev) => prev.filter((s) => s.id !== id))
            }
          />
        </TabsContent>
        <TabsContent value="equipment" className="mt-4">
          <EquipmentTab
            equipment={equipmentList}
            onAdd={(item) => setEquipmentList((prev) => [...prev, item])}
            onRemove={(id) =>
              setEquipmentList((prev) => prev.filter((e) => e.id !== id))
            }
          />
        </TabsContent>
        <TabsContent value="carts" className="mt-4">
          <CartsTab
            carts={cartsList}
            onAdd={(item) => setCartsList((prev) => [...prev, item])}
            onRemove={(id) =>
              setCartsList((prev) => prev.filter((c) => c.id !== id))
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
