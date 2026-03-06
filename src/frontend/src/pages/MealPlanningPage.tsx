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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  LayoutList,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type DietaryProfile,
  type Patient,
  type Ward,
  patients as initialPatients,
} from "../data/mockData";

// ─── Constants ───────────────────────────────────────────────────────────────

const dietaryColors: Record<DietaryProfile, string> = {
  Diabetic: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  "Low-Sodium": "bg-status-info/15 text-status-info border-status-info/30",
  Vegetarian: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  Renal: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Standard: "bg-muted text-muted-foreground border-border",
  "Soft Diet": "bg-chart-1/15 text-chart-1 border-chart-1/30",
  "Liquid Diet":
    "bg-status-critical/15 text-status-critical border-status-critical/30",
};

const mealStatusColors: Record<string, string> = {
  Delivered: "bg-status-ok/15 text-status-ok border-status-ok/30",
  Prepared: "bg-primary/15 text-primary border-primary/30",
  "In Progress": "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Pending: "bg-muted text-muted-foreground border-border",
};

const WARDS_FILTER = [
  "All Wards",
  "ICU",
  "Ward A",
  "Ward B",
  "Pediatrics",
] as const;
const MAIN_WARDS: Ward[] = ["ICU", "Ward A", "Ward B", "Pediatrics"];

const DIET_FILTER = [
  "All Diets",
  "Diabetic",
  "Low-Sodium",
  "Vegetarian",
  "Renal",
  "Standard",
  "Soft Diet",
  "Liquid Diet",
] as const;

const DIETARY_PROFILES: DietaryProfile[] = [
  "Diabetic",
  "Low-Sodium",
  "Vegetarian",
  "Renal",
  "Standard",
  "Soft Diet",
  "Liquid Diet",
];

const wardOcidKey: Record<Ward, string> = {
  ICU: "icu",
  "Ward A": "ward_a",
  "Ward B": "ward_b",
  Pediatrics: "pediatrics",
  Cardiology: "cardiology",
  Oncology: "oncology",
  Orthopedics: "orthopedics",
  Neurology: "neurology",
};

type ViewMode = "all" | "by_ward";

// ─── Sub-components ───────────────────────────────────────────────────────────

function MealStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "text-[9px] font-mono px-1.5 py-0.5 rounded border whitespace-nowrap",
        mealStatusColors[status],
      )}
    >
      {status}
    </span>
  );
}

function DietBadge({ diet }: { diet: DietaryProfile }) {
  return (
    <span
      className={cn(
        "text-[10px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap",
        dietaryColors[diet],
      )}
    >
      {diet}
    </span>
  );
}

function PatientDetailModal({
  patient,
  onClose,
}: {
  patient: Patient;
  onClose: () => void;
}) {
  const [nurseNote, setNurseNote] = useState(patient.nurseNotes);

  return (
    <DialogContent
      data-ocid="patient_detail.dialog"
      className="max-w-2xl bg-card border-border max-h-[90vh] flex flex-col"
    >
      <DialogHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <DialogTitle className="text-base font-bold">
              {patient.name}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {patient.id} · {patient.ward} · Room {patient.room}
            </p>
          </div>
          <DialogClose data-ocid="patient_detail.close_button" asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 pr-2">
          {/* Profile info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-accent/30 space-y-1">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Dietary Profile
              </p>
              <DietBadge diet={patient.dietaryProfile} />
            </div>
            <div className="p-3 rounded-lg bg-accent/30 space-y-1">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Allergies
              </p>
              <div className="flex flex-wrap gap-1">
                {patient.allergies.length === 0 ? (
                  <span className="text-xs text-muted-foreground">
                    None recorded
                  </span>
                ) : (
                  patient.allergies.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-status-critical/15 text-status-critical border border-status-critical/30"
                    >
                      {a}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Meal plan */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Today's Meal Plan
            </h3>
            {(["breakfast", "lunch", "dinner"] as const).map((meal) => {
              const m = patient.mealPlan[meal];
              return (
                <div
                  key={meal}
                  className="p-3 rounded-lg border border-border bg-card space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground capitalize">
                      {meal}
                    </p>
                    <MealStatusBadge status={m.status} />
                  </div>
                  <p className="text-sm text-foreground/90">{m.name}</p>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { label: "Calories", value: `${m.calories} kcal` },
                      { label: "Protein", value: `${m.protein}g` },
                      { label: "Carbs", value: `${m.carbs}g` },
                      { label: "Fat", value: `${m.fat}g` },
                    ].map((macro) => (
                      <div key={macro.label} className="text-center">
                        <p className="text-[10px] text-muted-foreground">
                          {macro.label}
                        </p>
                        <p className="text-xs font-mono font-semibold text-foreground">
                          {macro.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nurse notes */}
          <div className="space-y-2">
            <Label
              htmlFor="nurse-notes"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Nurse Notes
            </Label>
            <Textarea
              id="nurse-notes"
              value={nurseNote}
              onChange={(e) => setNurseNote(e.target.value)}
              className="text-xs resize-none bg-muted/50 border-border min-h-[80px]"
              placeholder="Add notes..."
              data-ocid="patient_detail.textarea"
            />
          </div>

          {/* Admitted */}
          <p className="text-xs text-muted-foreground">
            Admitted since:{" "}
            <span className="font-mono">{patient.admittedSince}</span>
          </p>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}

// ─── Add Patient Form ─────────────────────────────────────────────────────────

interface AddPatientFormState {
  name: string;
  room: string;
  dietaryProfile: DietaryProfile;
  allergies: string;
  nurseNotes: string;
}

const defaultForm: AddPatientFormState = {
  name: "",
  room: "",
  dietaryProfile: "Standard",
  allergies: "",
  nurseNotes: "",
};

function generateNextId(patientList: Patient[]): string {
  const maxNum = patientList.reduce((max, p) => {
    const match = p.id.match(/^PT-(\d+)$/);
    return match ? Math.max(max, Number.parseInt(match[1], 10)) : max;
  }, 0);
  return `PT-${String(maxNum + 1).padStart(3, "0")}`;
}

function buildDefaultMealPlan(diet: DietaryProfile): Patient["mealPlan"] {
  const mealNames: Record<
    DietaryProfile,
    { breakfast: string; lunch: string; dinner: string }
  > = {
    Diabetic: {
      breakfast: "Low-GI oatmeal with berries",
      lunch: "Grilled chicken with steamed vegetables",
      dinner: "Baked fish with quinoa",
    },
    "Low-Sodium": {
      breakfast: "Unsalted whole grain toast with avocado",
      lunch: "Herb-seasoned grilled turkey salad",
      dinner: "Baked cod with roasted vegetables",
    },
    Vegetarian: {
      breakfast: "Greek yogurt with granola and fruit",
      lunch: "Lentil soup with multigrain bread",
      dinner: "Vegetable curry with basmati rice",
    },
    Renal: {
      breakfast: "Egg white omelet with white toast",
      lunch: "Low-potassium rice with boiled chicken",
      dinner: "Steamed white fish fillet",
    },
    Standard: {
      breakfast: "Scrambled eggs with toast",
      lunch: "Grilled chicken with salad",
      dinner: "Roast dinner with vegetables",
    },
    "Soft Diet": {
      breakfast: "Oatmeal with soft banana",
      lunch: "Pureed vegetable soup",
      dinner: "Soft-cooked pasta with sauce",
    },
    "Liquid Diet": {
      breakfast: "Nutritional supplement shake",
      lunch: "Enteral nutrition formula – 400ml",
      dinner: "Enteral nutrition formula – 400ml",
    },
  };
  const names = mealNames[diet];
  return {
    breakfast: {
      name: names.breakfast,
      calories: 280,
      protein: 12,
      carbs: 38,
      fat: 8,
      status: "Pending",
    },
    lunch: {
      name: names.lunch,
      calories: 380,
      protein: 28,
      carbs: 42,
      fat: 10,
      status: "Pending",
    },
    dinner: {
      name: names.dinner,
      calories: 400,
      protein: 30,
      carbs: 44,
      fat: 12,
      status: "Pending",
    },
  };
}

interface AddPatientDialogProps {
  open: boolean;
  ward: Ward;
  onClose: () => void;
  onAdd: (patient: Patient) => void;
  patientList: Patient[];
}

function AddPatientDialog({
  open,
  ward,
  onClose,
  onAdd,
  patientList,
}: AddPatientDialogProps) {
  const [form, setForm] = useState<AddPatientFormState>(defaultForm);
  const [errors, setErrors] = useState<{ name?: string; room?: string }>({});

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm(defaultForm);
      setErrors({});
      onClose();
    }
  };

  const validate = () => {
    const newErrors: { name?: string; room?: string } = {};
    if (!form.name.trim()) newErrors.name = "Patient name is required";
    if (!form.room.trim()) newErrors.room = "Room number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const today = new Date().toISOString().slice(0, 10);
    const newPatient: Patient = {
      id: generateNextId(patientList),
      name: form.name.trim(),
      ward,
      room: form.room.trim(),
      dietaryProfile: form.dietaryProfile,
      allergies: form.allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      mealPlan: buildDefaultMealPlan(form.dietaryProfile),
      nurseNotes: form.nurseNotes.trim(),
      admittedSince: today,
    };

    onAdd(newPatient);
    toast.success(`Patient added to ${ward}`, {
      description: `${newPatient.name} (${newPatient.id}) · Room ${newPatient.room}`,
    });
    setForm(defaultForm);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="add_patient.dialog"
        className="max-w-md bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">
            Add Patient to {ward}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="add-name" className="text-xs font-medium">
              Patient Name <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="add-name"
              data-ocid="add_patient.name.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.name && "border-status-critical",
              )}
              placeholder="e.g. Sarah Mitchell"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name && (
              <p
                data-ocid="add_patient.name.error_state"
                className="text-[10px] text-status-critical"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Room */}
          <div className="space-y-1.5">
            <Label htmlFor="add-room" className="text-xs font-medium">
              Room <span className="text-status-critical">*</span>
            </Label>
            <Input
              id="add-room"
              data-ocid="add_patient.room.input"
              className={cn(
                "h-8 text-xs bg-muted/50 border-border",
                errors.room && "border-status-critical",
              )}
              placeholder={
                ward === "ICU"
                  ? "e.g. ICU-110"
                  : ward === "Ward A"
                    ? "e.g. A-220"
                    : ward === "Ward B"
                      ? "e.g. B-320"
                      : "e.g. PED-415"
              }
              value={form.room}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, room: e.target.value }));
                if (errors.room)
                  setErrors((prev) => ({ ...prev, room: undefined }));
              }}
            />
            {errors.room && (
              <p
                data-ocid="add_patient.room.error_state"
                className="text-[10px] text-status-critical"
              >
                {errors.room}
              </p>
            )}
          </div>

          {/* Dietary Profile */}
          <div className="space-y-1.5">
            <Label htmlFor="add-diet" className="text-xs font-medium">
              Dietary Profile
            </Label>
            <Select
              value={form.dietaryProfile}
              onValueChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  dietaryProfile: v as DietaryProfile,
                }))
              }
            >
              <SelectTrigger
                id="add-diet"
                data-ocid="add_patient.diet.select"
                className="h-8 text-xs bg-muted/50 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIETARY_PROFILES.map((d) => (
                  <SelectItem key={d} value={d} className="text-xs">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Allergies */}
          <div className="space-y-1.5">
            <Label htmlFor="add-allergies" className="text-xs font-medium">
              Allergies{" "}
              <span className="text-muted-foreground font-normal">
                (comma-separated, optional)
              </span>
            </Label>
            <Input
              id="add-allergies"
              data-ocid="add_patient.allergies.input"
              className="h-8 text-xs bg-muted/50 border-border"
              placeholder="e.g. Shellfish, Peanuts, Dairy"
              value={form.allergies}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, allergies: e.target.value }))
              }
            />
          </div>

          {/* Nurse Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="add-notes" className="text-xs font-medium">
              Nurse Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="add-notes"
              data-ocid="add_patient.notes.textarea"
              className="text-xs resize-none bg-muted/50 border-border min-h-[72px]"
              placeholder="Any clinical notes or dietary observations..."
              value={form.nurseNotes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nurseNotes: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            data-ocid="add_patient.cancel_button"
            className="text-xs border-border"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            data-ocid="add_patient.submit_button"
            className="text-xs"
            onClick={handleSubmit}
          >
            <Plus className="w-3 h-3 mr-1.5" />
            Add Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Ward Panel ───────────────────────────────────────────────────────────────

interface WardPanelProps {
  ward: Ward;
  patients: Patient[];
  onAddClick: (ward: Ward) => void;
  onRemoveClick: (patient: Patient) => void;
  onPatientClick: (patient: Patient) => void;
}

function WardPanel({
  ward,
  patients: wardPatients,
  onAddClick,
  onRemoveClick,
  onPatientClick,
}: WardPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const ocidKey = wardOcidKey[ward];

  const wardAccentColors: Record<string, string> = {
    ICU: "border-l-status-critical/60",
    "Ward A": "border-l-primary/60",
    "Ward B": "border-l-chart-4/60",
    Pediatrics: "border-l-chart-5/60",
  };

  const wardBgColors: Record<string, string> = {
    ICU: "bg-status-critical/8",
    "Ward A": "bg-primary/8",
    "Ward B": "bg-chart-4/8",
    Pediatrics: "bg-chart-5/8",
  };

  const wardTextColors: Record<string, string> = {
    ICU: "text-status-critical",
    "Ward A": "text-primary",
    "Ward B": "text-chart-4",
    Pediatrics: "text-chart-5",
  };

  return (
    <div
      data-ocid={`ward_view.${ocidKey}.panel`}
      className={cn(
        "rounded-lg border border-border bg-card border-l-4 overflow-hidden transition-all",
        wardAccentColors[ward] ?? "border-l-border",
      )}
    >
      {/* Ward header */}
      <div className="flex items-center justify-between px-4 py-3 hover:bg-accent/20 transition-colors group">
        <button
          type="button"
          onClick={() => setCollapsed((p) => !p)}
          className="flex items-center gap-3 flex-1 text-left"
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
          <span
            className={cn(
              "text-sm font-bold tracking-wide",
              wardTextColors[ward] ?? "text-foreground",
            )}
          >
            {ward}
          </span>
          <span
            className={cn(
              "text-[10px] font-mono px-2 py-0.5 rounded-full border",
              wardBgColors[ward] ?? "bg-muted",
              wardTextColors[ward] ?? "text-muted-foreground",
              "border-current/30",
            )}
          >
            {wardPatients.length} patient{wardPatients.length !== 1 ? "s" : ""}
          </span>
        </button>

        {/* Add Patient button */}
        <Button
          variant="outline"
          size="sm"
          data-ocid={`ward_view.${ocidKey}.open_modal_button`}
          className="h-7 text-[11px] border-border gap-1 hover:border-primary hover:text-primary"
          onClick={() => onAddClick(ward)}
        >
          <Plus className="w-3 h-3" />
          Add Patient
        </Button>
      </div>

      {/* Patient list */}
      {!collapsed && (
        <div className="border-t border-border/50">
          {wardPatients.length === 0 ? (
            <div
              data-ocid={`ward_view.${ocidKey}.empty_state`}
              className="py-8 text-center"
            >
              <p className="text-xs text-muted-foreground">
                No patients in {ward}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 text-[11px] text-primary hover:text-primary"
                onClick={() => onAddClick(ward)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add first patient
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {wardPatients.map((patient, idx) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/20 transition-colors group/row"
                >
                  {/* Clickable patient info area */}
                  <button
                    type="button"
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    onClick={() => onPatientClick(patient)}
                  >
                    {/* ID */}
                    <span className="text-[10px] font-mono text-muted-foreground/60 w-14 shrink-0">
                      {patient.id}
                    </span>

                    {/* Name */}
                    <span className="text-xs font-medium text-foreground min-w-0 flex-1 truncate">
                      {patient.name}
                    </span>

                    {/* Room */}
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 hidden sm:inline">
                      Room {patient.room}
                    </span>

                    {/* Diet badge */}
                    <DietBadge diet={patient.dietaryProfile} />

                    {/* Allergies */}
                    {patient.allergies.length > 0 && (
                      <div className="hidden lg:flex items-center gap-1 shrink-0">
                        {patient.allergies.slice(0, 2).map((a) => (
                          <span
                            key={a}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-status-critical/10 text-status-critical border border-status-critical/25"
                          >
                            {a}
                          </span>
                        ))}
                        {patient.allergies.length > 2 && (
                          <span className="text-[9px] text-muted-foreground">
                            +{patient.allergies.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    data-ocid={`ward_view.patient.delete_button.${idx + 1}`}
                    className="h-6 w-6 shrink-0 text-muted-foreground/40 hover:text-status-critical hover:bg-status-critical/10 opacity-0 group-hover/row:opacity-100 transition-all"
                    onClick={() => onRemoveClick(patient)}
                    aria-label={`Remove ${patient.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MealPlanningPage() {
  // State
  const [patientList, setPatientList] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All Wards");
  const [dietFilter, setDietFilter] = useState("All Diets");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Add patient dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogWard, setAddDialogWard] = useState<Ward>("ICU");

  // Remove confirmation state
  const [removeTarget, setRemoveTarget] = useState<Patient | null>(null);

  // Filtered list for "All Patients" view
  const filtered = patientList.filter((p) => {
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.room.toLowerCase().includes(search.toLowerCase());
    const matchWard = wardFilter === "All Wards" || p.ward === wardFilter;
    const matchDiet =
      dietFilter === "All Diets" || p.dietaryProfile === dietFilter;
    return matchSearch && matchWard && matchDiet;
  });

  // Handlers
  const handleAddPatient = (patient: Patient) => {
    setPatientList((prev) => [...prev, patient]);
  };

  const handleRemoveConfirm = () => {
    if (!removeTarget) return;
    const ward = removeTarget.ward;
    setPatientList((prev) => prev.filter((p) => p.id !== removeTarget.id));
    toast.success(`Patient removed from ${ward}`, {
      description: `${removeTarget.name} has been removed.`,
    });
    setRemoveTarget(null);
  };

  const openAddDialog = (ward: Ward) => {
    setAddDialogWard(ward);
    setAddDialogOpen(true);
  };

  return (
    <div
      data-ocid="meal_planning.page"
      className="p-4 md:p-6 space-y-4 max-w-screen-2xl mx-auto"
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Patient Meal Planning
          </h2>
          <p className="text-xs text-muted-foreground">
            {patientList.length} patients total
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/60 border border-border">
          <button
            type="button"
            data-ocid="meal_planning.view.tab"
            onClick={() => setViewMode("all")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all",
              viewMode === "all"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutList className="w-3 h-3" />
            All Patients
          </button>
          <button
            type="button"
            data-ocid="meal_planning.view.tab"
            onClick={() => setViewMode("by_ward")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all",
              viewMode === "by_ward"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Layers className="w-3 h-3" />
            By Ward
          </button>
        </div>
      </div>

      {/* Filters (only shown for All Patients view) */}
      {viewMode === "all" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              data-ocid="meal_planning.search_input"
              className="pl-9 h-8 text-xs bg-card border-border"
              placeholder="Search patients, ID, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={wardFilter} onValueChange={setWardFilter}>
            <SelectTrigger
              data-ocid="meal_planning.ward.select"
              className="w-full sm:w-36 h-8 text-xs bg-card border-border"
            >
              <SelectValue placeholder="Ward" />
            </SelectTrigger>
            <SelectContent>
              {WARDS_FILTER.map((w) => (
                <SelectItem key={w} value={w} className="text-xs">
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dietFilter} onValueChange={setDietFilter}>
            <SelectTrigger
              data-ocid="meal_planning.diet.select"
              className="w-full sm:w-40 h-8 text-xs bg-card border-border"
            >
              <SelectValue placeholder="Dietary" />
            </SelectTrigger>
            <SelectContent>
              {DIET_FILTER.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── All Patients (Table) view ── */}
      {viewMode === "all" && (
        <>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <ScrollArea className="w-full">
              <Table data-ocid="meal_planning.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] font-mono text-muted-foreground w-20">
                      ID
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground">
                      Patient
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground hidden md:table-cell">
                      Ward
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground hidden sm:table-cell">
                      Room
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground">
                      Diet
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground hidden lg:table-cell">
                      Allergies
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground hidden xl:table-cell">
                      B'fast
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground hidden xl:table-cell">
                      Lunch
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground hidden xl:table-cell">
                      Dinner
                    </TableHead>
                    <TableHead className="text-[10px] font-mono text-muted-foreground w-16" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow data-ocid="meal_planning.empty_state">
                      <TableCell colSpan={10} className="text-center py-10">
                        <p className="text-sm text-muted-foreground">
                          No patients match your filters
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((patient, idx) => (
                    <TableRow
                      key={patient.id}
                      data-ocid={`meal_planning.row.${idx + 1}`}
                      className="border-border/50 cursor-pointer hover:bg-accent/30 transition-colors"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <TableCell className="text-[10px] font-mono text-muted-foreground py-2.5">
                        {patient.id}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <p className="text-xs font-medium text-foreground">
                          {patient.name}
                        </p>
                      </TableCell>
                      <TableCell className="py-2.5 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {patient.ward}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 hidden sm:table-cell">
                        <span className="text-xs font-mono text-muted-foreground">
                          {patient.room}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <DietBadge diet={patient.dietaryProfile} />
                      </TableCell>
                      <TableCell className="py-2.5 hidden lg:table-cell">
                        {patient.allergies.length === 0 ? (
                          <span className="text-xs text-muted-foreground/50">
                            —
                          </span>
                        ) : (
                          <span className="text-[10px] text-status-critical">
                            {patient.allergies.join(", ")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-2.5 hidden xl:table-cell">
                        <MealStatusBadge
                          status={patient.mealPlan.breakfast.status}
                        />
                      </TableCell>
                      <TableCell className="py-2.5 hidden xl:table-cell">
                        <MealStatusBadge
                          status={patient.mealPlan.lunch.status}
                        />
                      </TableCell>
                      <TableCell className="py-2.5 hidden xl:table-cell">
                        <MealStatusBadge
                          status={patient.mealPlan.dinner.status}
                        />
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                          }}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Dietary legend */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Info className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
            {Object.entries(dietaryColors).map(([diet, cls]) => (
              <span
                key={diet}
                className={cn("text-[10px] px-1.5 py-0.5 rounded border", cls)}
              >
                {diet}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ── By Ward view ── */}
      {viewMode === "by_ward" && (
        <div className="space-y-3">
          {/* Ward search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              data-ocid="meal_planning.search_input"
              className="pl-9 h-8 text-xs bg-card border-border"
              placeholder="Search patients in wards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Ward panels */}
          {MAIN_WARDS.map((ward) => {
            const wardPatients = patientList.filter((p) => {
              const matchWard = p.ward === ward;
              const matchSearch =
                search === "" ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.id.toLowerCase().includes(search.toLowerCase()) ||
                p.room.toLowerCase().includes(search.toLowerCase());
              return matchWard && matchSearch;
            });

            return (
              <WardPanel
                key={ward}
                ward={ward}
                patients={wardPatients}
                onAddClick={openAddDialog}
                onRemoveClick={(p) => setRemoveTarget(p)}
                onPatientClick={setSelectedPatient}
              />
            );
          })}

          {/* Summary stats */}
          <div className="flex items-center gap-4 pt-1 pl-1">
            <p className="text-[10px] text-muted-foreground">
              Showing{" "}
              <span className="text-foreground font-medium">
                {MAIN_WARDS.reduce(
                  (sum, ward) =>
                    sum + patientList.filter((p) => p.ward === ward).length,
                  0,
                )}
              </span>{" "}
              patients across {MAIN_WARDS.length} wards
            </p>
            {patientList.some(
              (p) =>
                !MAIN_WARDS.includes(p.ward as (typeof MAIN_WARDS)[number]),
            ) && (
              <Badge variant="outline" className="text-[10px] border-border">
                +
                {
                  patientList.filter(
                    (p) =>
                      !MAIN_WARDS.includes(
                        p.ward as (typeof MAIN_WARDS)[number],
                      ),
                  ).length
                }{" "}
                in other wards
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* ── Patient Detail Dialog ── */}
      <Dialog
        open={selectedPatient !== null}
        onOpenChange={(open) => !open && setSelectedPatient(null)}
      >
        {selectedPatient && (
          <PatientDetailModal
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        )}
      </Dialog>

      {/* ── Add Patient Dialog ── */}
      <AddPatientDialog
        open={addDialogOpen}
        ward={addDialogWard}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddPatient}
        patientList={patientList}
      />

      {/* ── Remove Confirmation AlertDialog ── */}
      <AlertDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent className="bg-card border-border max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold">
              Remove Patient
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Remove{" "}
              <span className="text-foreground font-semibold">
                {removeTarget?.name}
              </span>{" "}
              ({removeTarget?.id}) from{" "}
              <span className="text-foreground font-semibold">
                {removeTarget?.ward}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              data-ocid="remove_patient.cancel_button"
              className="h-8 text-xs border-border"
              onClick={() => setRemoveTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="remove_patient.confirm_button"
              className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRemoveConfirm}
            >
              Remove Patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
