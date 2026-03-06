// ============================================================
// MealOps AI - Mock Data
// ============================================================

export type Ward =
  | "ICU"
  | "Ward A"
  | "Ward B"
  | "Pediatrics"
  | "Cardiology"
  | "Oncology"
  | "Orthopedics"
  | "Neurology";
export type DietaryProfile =
  | "Diabetic"
  | "Low-Sodium"
  | "Vegetarian"
  | "Renal"
  | "Standard"
  | "Soft Diet"
  | "Liquid Diet";
export type MealStatus = "Prepared" | "In Progress" | "Pending" | "Delivered";
export type StaffRole =
  | "Head Chef"
  | "Chef"
  | "Dietitian"
  | "Porter"
  | "Supervisor"
  | "Kitchen Assistant";
export type Shift = "Morning" | "Evening" | "Night";
export type EquipmentStatus = "Active" | "Idle" | "Maintenance";
export type CartStatus = "Loading" | "In Transit" | "Returned" | "Available";
export type DeliveryStatus = "Pending" | "In Transit" | "Delivered" | "Delayed";
export type StationStatus = "Active" | "Idle" | "Alert";
export type RecommendationSeverity = "Critical" | "Warning" | "Info";
export type RecommendationCategory =
  | "Waste Reduction"
  | "Speed"
  | "Compliance"
  | "Resource";
export type IngredientStatus = "OK" | "Low" | "Critical";

export interface Patient {
  id: string;
  name: string;
  ward: Ward;
  room: string;
  dietaryProfile: DietaryProfile;
  allergies: string[];
  mealPlan: {
    breakfast: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      status: MealStatus;
    };
    lunch: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      status: MealStatus;
    };
    dinner: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      status: MealStatus;
    };
  };
  nurseNotes: string;
  admittedSince: string;
}

export interface AIRecommendation {
  id: string;
  severity: RecommendationSeverity;
  category: RecommendationCategory;
  title: string;
  description: string;
  confidence: number;
  impact: string;
  timestamp: string;
  applied: boolean;
  dismissed: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  parLevel: number;
  maxLevel: number;
  status: IngredientStatus;
  lastRestocked: string;
}

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  shift: Shift;
  currentAssignment: string;
  availability: "Available" | "On Break" | "Off Duty" | "Busy";
  avatar: string;
}

export interface Equipment {
  id: string;
  name: string;
  location: string;
  status: EquipmentStatus;
  lastServiced: string;
  utilizationPercent: number;
  nextMaintenance: string;
}

export interface MealCart {
  id: string;
  assignedWard: string;
  mealsLoaded: number;
  capacity: number;
  departureTime: string;
  returnTime: string;
  status: CartStatus;
  assignedPorter: string;
}

export interface WardDelivery {
  id: string;
  ward: Ward;
  assignedCart: string;
  scheduledTime: string;
  actualTime: string;
  mealsCount: number;
  status: DeliveryStatus;
  patients: string[];
}

export interface ActivityEvent {
  id: string;
  type:
    | "meal_prepared"
    | "cart_dispatched"
    | "dietary_flag"
    | "ai_alert"
    | "delivery_completed"
    | "restock_alert"
    | "staff_update";
  message: string;
  timestamp: string;
  severity?: "info" | "warning" | "critical";
}

// ============================================================
// PATIENTS (20)
// ============================================================
export const patients: Patient[] = [
  {
    id: "PT-001",
    name: "Margaret Chen",
    ward: "ICU",
    room: "ICU-101",
    dietaryProfile: "Diabetic",
    allergies: ["Shellfish", "Peanuts"],
    mealPlan: {
      breakfast: {
        name: "Steel-cut oats with berries",
        calories: 280,
        protein: 9,
        carbs: 42,
        fat: 6,
        status: "Delivered",
      },
      lunch: {
        name: "Grilled chicken & steamed broccoli",
        calories: 380,
        protein: 38,
        carbs: 18,
        fat: 14,
        status: "Delivered",
      },
      dinner: {
        name: "Baked salmon with quinoa",
        calories: 420,
        protein: 35,
        carbs: 32,
        fat: 16,
        status: "In Progress",
      },
    },
    nurseNotes:
      "Patient tolerating diet well. Monitor blood glucose post-meals.",
    admittedSince: "2026-03-01",
  },
  {
    id: "PT-002",
    name: "Robert Okonkwo",
    ward: "ICU",
    room: "ICU-103",
    dietaryProfile: "Renal",
    allergies: ["Dairy"],
    mealPlan: {
      breakfast: {
        name: "Egg white omelet with toast",
        calories: 220,
        protein: 18,
        carbs: 24,
        fat: 5,
        status: "Delivered",
      },
      lunch: {
        name: "Rice with low-potassium vegetables",
        calories: 340,
        protein: 12,
        carbs: 58,
        fat: 6,
        status: "Delivered",
      },
      dinner: {
        name: "Steamed white fish fillet",
        calories: 290,
        protein: 28,
        carbs: 22,
        fat: 8,
        status: "Pending",
      },
    },
    nurseNotes:
      "Strict fluid restriction 1.5L/day. Potassium levels being monitored.",
    admittedSince: "2026-02-28",
  },
  {
    id: "PT-003",
    name: "Priya Sharma",
    ward: "ICU",
    room: "ICU-105",
    dietaryProfile: "Vegetarian",
    allergies: [],
    mealPlan: {
      breakfast: {
        name: "Greek yogurt with granola",
        calories: 320,
        protein: 14,
        carbs: 46,
        fat: 8,
        status: "Delivered",
      },
      lunch: {
        name: "Lentil soup with multigrain bread",
        calories: 410,
        protein: 22,
        carbs: 62,
        fat: 9,
        status: "In Progress",
      },
      dinner: {
        name: "Paneer tikka with basmati rice",
        calories: 490,
        protein: 26,
        carbs: 54,
        fat: 18,
        status: "Pending",
      },
    },
    nurseNotes: "No dietary concerns. Maintain protein intake.",
    admittedSince: "2026-03-03",
  },
  {
    id: "PT-004",
    name: "James Holloway",
    ward: "Ward A",
    room: "A-201",
    dietaryProfile: "Low-Sodium",
    allergies: ["Gluten"],
    mealPlan: {
      breakfast: {
        name: "Gluten-free toast with avocado",
        calories: 310,
        protein: 8,
        carbs: 36,
        fat: 16,
        status: "Delivered",
      },
      lunch: {
        name: "Quinoa salad with grilled turkey",
        calories: 390,
        protein: 32,
        carbs: 42,
        fat: 12,
        status: "Delivered",
      },
      dinner: {
        name: "Herb-crusted chicken with mashed potato",
        calories: 450,
        protein: 36,
        carbs: 38,
        fat: 14,
        status: "In Progress",
      },
    },
    nurseNotes: "Hypertension management. Verify all meals are gluten-free.",
    admittedSince: "2026-03-02",
  },
  {
    id: "PT-005",
    name: "Fatima Al-Hassan",
    ward: "Ward A",
    room: "A-203",
    dietaryProfile: "Diabetic",
    allergies: ["Tree Nuts"],
    mealPlan: {
      breakfast: {
        name: "Whole wheat toast with boiled egg",
        calories: 260,
        protein: 14,
        carbs: 30,
        fat: 9,
        status: "Delivered",
      },
      lunch: {
        name: "Brown rice with stir-fried vegetables",
        calories: 350,
        protein: 16,
        carbs: 56,
        fat: 8,
        status: "Delivered",
      },
      dinner: {
        name: "Grilled tilapia with green beans",
        calories: 320,
        protein: 34,
        carbs: 16,
        fat: 10,
        status: "Pending",
      },
    },
    nurseNotes: "HbA1c monitoring. Schedule meals at consistent times.",
    admittedSince: "2026-03-04",
  },
  {
    id: "PT-006",
    name: "David Brennan",
    ward: "Ward A",
    room: "A-207",
    dietaryProfile: "Standard",
    allergies: [],
    mealPlan: {
      breakfast: {
        name: "Scrambled eggs with toast and juice",
        calories: 380,
        protein: 18,
        carbs: 44,
        fat: 14,
        status: "Delivered",
      },
      lunch: {
        name: "Beef lasagna with garden salad",
        calories: 520,
        protein: 28,
        carbs: 58,
        fat: 22,
        status: "Delivered",
      },
      dinner: {
        name: "Roast chicken with roasted vegetables",
        calories: 480,
        protein: 40,
        carbs: 32,
        fat: 18,
        status: "In Progress",
      },
    },
    nurseNotes: "Good appetite. No restrictions.",
    admittedSince: "2026-03-05",
  },
  {
    id: "PT-007",
    name: "Amelia Thompson",
    ward: "Ward A",
    room: "A-210",
    dietaryProfile: "Soft Diet",
    allergies: ["Eggs"],
    mealPlan: {
      breakfast: {
        name: "Oatmeal with soft banana and honey",
        calories: 290,
        protein: 7,
        carbs: 52,
        fat: 5,
        status: "Delivered",
      },
      lunch: {
        name: "Pureed butternut squash soup",
        calories: 220,
        protein: 6,
        carbs: 36,
        fat: 7,
        status: "Prepared",
      },
      dinner: {
        name: "Soft-cooked pasta with tomato sauce",
        calories: 380,
        protein: 12,
        carbs: 62,
        fat: 9,
        status: "Pending",
      },
    },
    nurseNotes: "Post-op jaw surgery. All foods must be soft/pureed.",
    admittedSince: "2026-03-03",
  },
  {
    id: "PT-008",
    name: "Chen Wei-Lin",
    ward: "Ward B",
    room: "B-301",
    dietaryProfile: "Standard",
    allergies: ["Shellfish"],
    mealPlan: {
      breakfast: {
        name: "Congee with side dishes",
        calories: 340,
        protein: 12,
        carbs: 58,
        fat: 6,
        status: "Delivered",
      },
      lunch: {
        name: "Stir-fried rice with vegetables and chicken",
        calories: 450,
        protein: 26,
        carbs: 62,
        fat: 12,
        status: "Delivered",
      },
      dinner: {
        name: "Braised pork with bok choy",
        calories: 440,
        protein: 32,
        carbs: 28,
        fat: 20,
        status: "In Progress",
      },
    },
    nurseNotes: "Cultural food preferences noted.",
    admittedSince: "2026-03-01",
  },
  {
    id: "PT-009",
    name: "Natalie Russo",
    ward: "Ward B",
    room: "B-304",
    dietaryProfile: "Vegetarian",
    allergies: ["Soy"],
    mealPlan: {
      breakfast: {
        name: "Fresh fruit bowl with cottage cheese",
        calories: 240,
        protein: 12,
        carbs: 38,
        fat: 5,
        status: "Delivered",
      },
      lunch: {
        name: "Vegetable curry with white rice",
        calories: 420,
        protein: 14,
        carbs: 68,
        fat: 11,
        status: "Delivered",
      },
      dinner: {
        name: "Cheese and vegetable frittata",
        calories: 360,
        protein: 20,
        carbs: 18,
        fat: 22,
        status: "Prepared",
      },
    },
    nurseNotes: "No soy-based products. Check ingredient labels carefully.",
    admittedSince: "2026-03-02",
  },
  {
    id: "PT-010",
    name: "Marcus Williams",
    ward: "Ward B",
    room: "B-308",
    dietaryProfile: "Low-Sodium",
    allergies: [],
    mealPlan: {
      breakfast: {
        name: "Unsalted oatmeal with fresh berries",
        calories: 270,
        protein: 8,
        carbs: 48,
        fat: 5,
        status: "Delivered",
      },
      lunch: {
        name: "Herb-seasoned grilled chicken salad",
        calories: 360,
        protein: 34,
        carbs: 20,
        fat: 14,
        status: "In Progress",
      },
      dinner: {
        name: "Baked cod with lemon and herbs",
        calories: 310,
        protein: 30,
        carbs: 18,
        fat: 10,
        status: "Pending",
      },
    },
    nurseNotes: "Cardiac patient. Strict sodium limit 1500mg/day.",
    admittedSince: "2026-03-04",
  },
  {
    id: "PT-011",
    name: "Sophie Laurent",
    ward: "Ward B",
    room: "B-312",
    dietaryProfile: "Standard",
    allergies: ["Lactose"],
    mealPlan: {
      breakfast: {
        name: "Oat milk smoothie with toast",
        calories: 320,
        protein: 10,
        carbs: 52,
        fat: 8,
        status: "Delivered",
      },
      lunch: {
        name: "Grilled salmon with asparagus",
        calories: 420,
        protein: 36,
        carbs: 16,
        fat: 18,
        status: "Delivered",
      },
      dinner: {
        name: "Chicken stir-fry with noodles",
        calories: 460,
        protein: 34,
        carbs: 50,
        fat: 14,
        status: "Pending",
      },
    },
    nurseNotes: "Lactose intolerant. Use plant-based alternatives.",
    admittedSince: "2026-03-03",
  },
  {
    id: "PT-012",
    name: "Oliver Kowalski",
    ward: "Pediatrics",
    room: "PED-401",
    dietaryProfile: "Standard",
    allergies: ["Peanuts"],
    mealPlan: {
      breakfast: {
        name: "Pancakes with maple syrup and fruit",
        calories: 380,
        protein: 8,
        carbs: 72,
        fat: 8,
        status: "Delivered",
      },
      lunch: {
        name: "Macaroni and cheese with veggies",
        calories: 420,
        protein: 16,
        carbs: 62,
        fat: 14,
        status: "Delivered",
      },
      dinner: {
        name: "Chicken nuggets with mashed potato",
        calories: 440,
        protein: 22,
        carbs: 52,
        fat: 16,
        status: "In Progress",
      },
    },
    nurseNotes:
      "Age 8. Picky eater. Include variety. NO peanuts — severe allergy.",
    admittedSince: "2026-03-04",
  },
  {
    id: "PT-013",
    name: "Emma Rodriguez",
    ward: "Pediatrics",
    room: "PED-403",
    dietaryProfile: "Diabetic",
    allergies: [],
    mealPlan: {
      breakfast: {
        name: "Low-GI cereal with skimmed milk",
        calories: 260,
        protein: 10,
        carbs: 42,
        fat: 4,
        status: "Delivered",
      },
      lunch: {
        name: "Turkey sandwich on whole grain bread",
        calories: 340,
        protein: 24,
        carbs: 38,
        fat: 10,
        status: "Delivered",
      },
      dinner: {
        name: "Grilled chicken strips with salad",
        calories: 320,
        protein: 28,
        carbs: 22,
        fat: 12,
        status: "Prepared",
      },
    },
    nurseNotes:
      "Age 11. Type 1 diabetes. Carb counting required — notify team pre-meal.",
    admittedSince: "2026-03-02",
  },
  {
    id: "PT-014",
    name: "Noah Patel",
    ward: "Pediatrics",
    room: "PED-406",
    dietaryProfile: "Vegetarian",
    allergies: ["Eggs", "Dairy"],
    mealPlan: {
      breakfast: {
        name: "Vegan smoothie bowl with granola",
        calories: 300,
        protein: 9,
        carbs: 54,
        fat: 8,
        status: "Delivered",
      },
      lunch: {
        name: "Chickpea and vegetable wrap",
        calories: 380,
        protein: 16,
        carbs: 56,
        fat: 10,
        status: "In Progress",
      },
      dinner: {
        name: "Vegan pasta primavera",
        calories: 360,
        protein: 14,
        carbs: 60,
        fat: 8,
        status: "Pending",
      },
    },
    nurseNotes:
      "Age 6. Vegan diet per family request. All meals dairy and egg free.",
    admittedSince: "2026-03-05",
  },
  {
    id: "PT-015",
    name: "Grace Adeyemi",
    ward: "Pediatrics",
    room: "PED-408",
    dietaryProfile: "Standard",
    allergies: [],
    mealPlan: {
      breakfast: {
        name: "Eggs on toast with orange juice",
        calories: 360,
        protein: 16,
        carbs: 42,
        fat: 14,
        status: "Delivered",
      },
      lunch: {
        name: "Fish and chips with peas",
        calories: 520,
        protein: 28,
        carbs: 58,
        fat: 20,
        status: "Delivered",
      },
      dinner: {
        name: "Beef stew with crusty bread",
        calories: 480,
        protein: 32,
        carbs: 48,
        fat: 16,
        status: "Pending",
      },
    },
    nurseNotes: "Age 9. Good appetite. No restrictions.",
    admittedSince: "2026-03-03",
  },
  {
    id: "PT-016",
    name: "Thomas Bergmann",
    ward: "ICU",
    room: "ICU-108",
    dietaryProfile: "Liquid Diet",
    allergies: ["Gluten", "Dairy"],
    mealPlan: {
      breakfast: {
        name: "Glucose saline + nutritional shake",
        calories: 240,
        protein: 12,
        carbs: 32,
        fat: 6,
        status: "Delivered",
      },
      lunch: {
        name: "Enteral nutrition formula - 400ml",
        calories: 400,
        protein: 20,
        carbs: 48,
        fat: 12,
        status: "Delivered",
      },
      dinner: {
        name: "Enteral nutrition formula - 400ml",
        calories: 400,
        protein: 20,
        carbs: 48,
        fat: 12,
        status: "In Progress",
      },
    },
    nurseNotes:
      "Post-op GI surgery. Enteral only. No oral intake without medical clearance.",
    admittedSince: "2026-02-27",
  },
  {
    id: "PT-017",
    name: "Isabella Moreau",
    ward: "Ward A",
    room: "A-214",
    dietaryProfile: "Renal",
    allergies: ["Shellfish"],
    mealPlan: {
      breakfast: {
        name: "White bread toast with jam",
        calories: 200,
        protein: 4,
        carbs: 42,
        fat: 3,
        status: "Delivered",
      },
      lunch: {
        name: "Low-potassium rice bowl",
        calories: 320,
        protein: 10,
        carbs: 62,
        fat: 5,
        status: "Prepared",
      },
      dinner: {
        name: "Boiled chicken with white rice",
        calories: 360,
        protein: 28,
        carbs: 44,
        fat: 8,
        status: "Pending",
      },
    },
    nurseNotes:
      "CKD Stage 4. Phosphate and potassium restricted. Fluid limit 1L/day.",
    admittedSince: "2026-03-01",
  },
  {
    id: "PT-018",
    name: "Alexander Kim",
    ward: "Ward B",
    room: "B-316",
    dietaryProfile: "Standard",
    allergies: [],
    mealPlan: {
      breakfast: {
        name: "Full English breakfast (modified)",
        calories: 480,
        protein: 22,
        carbs: 44,
        fat: 24,
        status: "Delivered",
      },
      lunch: {
        name: "Club sandwich with soup",
        calories: 540,
        protein: 30,
        carbs: 56,
        fat: 22,
        status: "Delivered",
      },
      dinner: {
        name: "Spaghetti bolognese with garlic bread",
        calories: 580,
        protein: 32,
        carbs: 68,
        fat: 18,
        status: "In Progress",
      },
    },
    nurseNotes:
      "Post-hip surgery. Good recovery. High protein diet encouraged.",
    admittedSince: "2026-03-04",
  },
  {
    id: "PT-019",
    name: "Yuki Tanaka",
    ward: "Ward A",
    room: "A-218",
    dietaryProfile: "Low-Sodium",
    allergies: ["Soy"],
    mealPlan: {
      breakfast: {
        name: "Brown rice porridge with pickled vegetables",
        calories: 280,
        protein: 8,
        carbs: 52,
        fat: 4,
        status: "Delivered",
      },
      lunch: {
        name: "Grilled mackerel with steamed rice",
        calories: 400,
        protein: 32,
        carbs: 46,
        fat: 14,
        status: "Prepared",
      },
      dinner: {
        name: "Miso-free soup with tofu and rice",
        calories: 360,
        protein: 18,
        carbs: 52,
        fat: 10,
        status: "Pending",
      },
    },
    nurseNotes:
      "No soy sauce or soy-based condiments. Check Asian recipe ingredients.",
    admittedSince: "2026-03-02",
  },
  {
    id: "PT-020",
    name: "Elizabeth Owusu",
    ward: "Pediatrics",
    room: "PED-412",
    dietaryProfile: "Standard",
    allergies: ["Tree Nuts", "Peanuts"],
    mealPlan: {
      breakfast: {
        name: "Banana and honey oatmeal",
        calories: 310,
        protein: 7,
        carbs: 58,
        fat: 5,
        status: "Delivered",
      },
      lunch: {
        name: "Cheese pizza with garden salad",
        calories: 480,
        protein: 18,
        carbs: 64,
        fat: 18,
        status: "Delivered",
      },
      dinner: {
        name: "Spaghetti marinara with garlic bread",
        calories: 460,
        protein: 16,
        carbs: 72,
        fat: 12,
        status: "Prepared",
      },
    },
    nurseNotes:
      "Age 7. Severe nut allergy. EpiPen prescribed. Strict nut-free kitchen protocol.",
    admittedSince: "2026-03-05",
  },
];

// ============================================================
// AI RECOMMENDATIONS (12)
// ============================================================
export const recommendations: AIRecommendation[] = [
  {
    id: "REC-001",
    severity: "Critical",
    category: "Waste Reduction",
    title: "Evening Meal Over-Production Detected",
    description:
      "Historical data shows 23% of dinner portions remain unconsumed on weekdays. Recommend reducing dinner batch by 18 portions across Ward A and Ward B to minimize food waste.",
    confidence: 94,
    impact: "Save 18 kg food waste/week",
    timestamp: "2026-03-06T14:32:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-002",
    severity: "Critical",
    category: "Compliance",
    title: "Renal Diet Potassium Violation Risk",
    description:
      "Current batch for patients PT-002 and PT-017 contains sweet potato listed as ingredient. Sweet potato exceeds renal dietary potassium limits (>400mg/100g). Substitute required immediately.",
    confidence: 99,
    impact: "Prevent adverse clinical event",
    timestamp: "2026-03-06T14:15:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-003",
    severity: "Warning",
    category: "Speed",
    title: "Lunch Service Bottleneck at Plating Station",
    description:
      "Plating Station throughput is 22% below target during 11:30-12:30 window. Adding one kitchen assistant to plating rotation will reduce lunch delivery delays by an estimated 14 minutes.",
    confidence: 87,
    impact: "Reduce lunch prep time by 14 min",
    timestamp: "2026-03-06T13:58:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-004",
    severity: "Warning",
    category: "Resource",
    title: "Chicken Breast Stock Below Par Level",
    description:
      "Current chicken breast stock is at 4.2 kg, which is 68% below the par level of 13 kg. At current consumption rate, stock will be depleted before evening service. Immediate reorder required.",
    confidence: 98,
    impact: "Prevent service disruption for 8 patients",
    timestamp: "2026-03-06T13:45:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-005",
    severity: "Warning",
    category: "Waste Reduction",
    title: "Bread Over-Ordering Pattern Identified",
    description:
      "Analysis of last 14 days shows bread wastage averaging 8.3 kg/day (38% of daily order). Recommend reducing weekly bread order by 30% and shifting to daily smaller deliveries.",
    confidence: 91,
    impact: "Save 58 kg bread waste/week",
    timestamp: "2026-03-06T12:30:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-006",
    severity: "Info",
    category: "Speed",
    title: "Optimize Breakfast Batch Scheduling",
    description:
      "Staggering breakfast preparation by ward in 15-minute intervals (ICU first, then Ward A/B, then Pediatrics) would reduce cart loading conflicts and improve on-time delivery from 82% to ~94%.",
    confidence: 78,
    impact: "Improve on-time delivery by 12%",
    timestamp: "2026-03-06T11:20:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-007",
    severity: "Info",
    category: "Resource",
    title: "Morning Shift Staffing Optimization",
    description:
      "Data indicates 3 staff are idle during 06:00-07:00 breakfast prep window while only 1 person handles ICU special diet preparation. Redistribute workload for efficiency.",
    confidence: 82,
    impact: "Reduce overtime by 2.5 hrs/week",
    timestamp: "2026-03-06T10:45:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-008",
    severity: "Critical",
    category: "Compliance",
    title: "Allergen Cross-Contamination Risk",
    description:
      "Patient PT-020 (Elizabeth Owusu, severe peanut allergy) is scheduled for a meal batch produced on Prep Station 2 which was used for peanut sauce earlier today. Thorough sanitation protocol must be completed before use.",
    confidence: 96,
    impact: "Prevent severe allergic reaction",
    timestamp: "2026-03-06T14:48:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-009",
    severity: "Info",
    category: "Waste Reduction",
    title: "Seasonal Menu Adjustment",
    description:
      "Spring seasonal vegetables (peas, asparagus, spinach) are 40% cheaper than current winter substitutes. Menu update could reduce ingredient costs by ₹2,400/week while improving nutritional value.",
    confidence: 85,
    impact: "Save ₹2,400 ingredient cost/week",
    timestamp: "2026-03-06T09:30:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-010",
    severity: "Warning",
    category: "Speed",
    title: "Blast Chiller Utilization Opportunity",
    description:
      "Blast Chiller 1 is idle 68% of meal prep time. Pre-cooking and blast-chilling proteins during off-peak hours (14:00-16:00) could shorten dinner service preparation by 25 minutes.",
    confidence: 80,
    impact: "Reduce dinner prep time by 25 min",
    timestamp: "2026-03-06T09:00:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-011",
    severity: "Info",
    category: "Compliance",
    title: "HACCP Temperature Log Gap Detected",
    description:
      "Temperature logs for Steamer unit show a 45-minute data gap between 11:15-12:00. Manual log entry required for compliance audit. Sensor recalibration recommended.",
    confidence: 99,
    impact: "Maintain HACCP compliance",
    timestamp: "2026-03-06T08:30:00",
    applied: false,
    dismissed: false,
  },
  {
    id: "REC-012",
    severity: "Warning",
    category: "Resource",
    title: "Oven 2 Efficiency Drop",
    description:
      "Oven 2 is consuming 18% more energy than baseline for equivalent output, suggesting heating element degradation. Schedule preventive maintenance in the next 48 hours to avoid breakdown during peak service.",
    confidence: 88,
    impact: "Prevent service interruption, save energy",
    timestamp: "2026-03-06T07:45:00",
    applied: false,
    dismissed: false,
  },
];

// ============================================================
// INGREDIENTS (15)
// ============================================================
export const ingredients: Ingredient[] = [
  {
    id: "ING-001",
    name: "Chicken Breast",
    category: "Protein",
    currentStock: 4.2,
    unit: "kg",
    parLevel: 13,
    maxLevel: 25,
    status: "Critical",
    lastRestocked: "2026-03-04",
  },
  {
    id: "ING-002",
    name: "Salmon Fillet",
    category: "Protein",
    currentStock: 8.5,
    unit: "kg",
    parLevel: 10,
    maxLevel: 20,
    status: "Low",
    lastRestocked: "2026-03-05",
  },
  {
    id: "ING-003",
    name: "White Rice",
    category: "Grains",
    currentStock: 45,
    unit: "kg",
    parLevel: 20,
    maxLevel: 60,
    status: "OK",
    lastRestocked: "2026-03-03",
  },
  {
    id: "ING-004",
    name: "Brown Rice",
    category: "Grains",
    currentStock: 12,
    unit: "kg",
    parLevel: 10,
    maxLevel: 25,
    status: "OK",
    lastRestocked: "2026-03-03",
  },
  {
    id: "ING-005",
    name: "Fresh Broccoli",
    category: "Vegetables",
    currentStock: 3.8,
    unit: "kg",
    parLevel: 8,
    maxLevel: 15,
    status: "Critical",
    lastRestocked: "2026-03-04",
  },
  {
    id: "ING-006",
    name: "Whole Wheat Bread",
    category: "Bakery",
    currentStock: 18,
    unit: "loaves",
    parLevel: 12,
    maxLevel: 30,
    status: "OK",
    lastRestocked: "2026-03-06",
  },
  {
    id: "ING-007",
    name: "Eggs (Free Range)",
    category: "Dairy & Eggs",
    currentStock: 144,
    unit: "units",
    parLevel: 96,
    maxLevel: 240,
    status: "OK",
    lastRestocked: "2026-03-05",
  },
  {
    id: "ING-008",
    name: "Skimmed Milk",
    category: "Dairy & Eggs",
    currentStock: 12,
    unit: "liters",
    parLevel: 20,
    maxLevel: 40,
    status: "Low",
    lastRestocked: "2026-03-05",
  },
  {
    id: "ING-009",
    name: "Oats (Rolled)",
    category: "Grains",
    currentStock: 22,
    unit: "kg",
    parLevel: 10,
    maxLevel: 30,
    status: "OK",
    lastRestocked: "2026-03-03",
  },
  {
    id: "ING-010",
    name: "Olive Oil",
    category: "Condiments",
    currentStock: 4,
    unit: "liters",
    parLevel: 5,
    maxLevel: 10,
    status: "Low",
    lastRestocked: "2026-03-02",
  },
  {
    id: "ING-011",
    name: "Lentils (Red)",
    category: "Legumes",
    currentStock: 15,
    unit: "kg",
    parLevel: 8,
    maxLevel: 20,
    status: "OK",
    lastRestocked: "2026-03-03",
  },
  {
    id: "ING-012",
    name: "Fresh Spinach",
    category: "Vegetables",
    currentStock: 2.1,
    unit: "kg",
    parLevel: 6,
    maxLevel: 12,
    status: "Critical",
    lastRestocked: "2026-03-05",
  },
  {
    id: "ING-013",
    name: "Quinoa",
    category: "Grains",
    currentStock: 6,
    unit: "kg",
    parLevel: 5,
    maxLevel: 15,
    status: "OK",
    lastRestocked: "2026-03-04",
  },
  {
    id: "ING-014",
    name: "Low-Sodium Vegetable Stock",
    category: "Condiments",
    currentStock: 8,
    unit: "liters",
    parLevel: 10,
    maxLevel: 20,
    status: "Low",
    lastRestocked: "2026-03-04",
  },
  {
    id: "ING-015",
    name: "Cod Fillet",
    category: "Protein",
    currentStock: 9,
    unit: "kg",
    parLevel: 8,
    maxLevel: 18,
    status: "OK",
    lastRestocked: "2026-03-05",
  },
];

// ============================================================
// STAFF (10)
// ============================================================
export const staff: Staff[] = [
  {
    id: "STF-001",
    name: "Chef Marcus Reynolds",
    role: "Head Chef",
    shift: "Morning",
    currentAssignment: "Overseeing breakfast & lunch production",
    availability: "Busy",
    avatar: "MR",
  },
  {
    id: "STF-002",
    name: "Priya Nair",
    role: "Chef",
    shift: "Morning",
    currentAssignment: "Cooking Station – protein batch",
    availability: "Busy",
    avatar: "PN",
  },
  {
    id: "STF-003",
    name: "James Osei",
    role: "Chef",
    shift: "Morning",
    currentAssignment: "Prep Station – vegetable mise en place",
    availability: "Busy",
    avatar: "JO",
  },
  {
    id: "STF-004",
    name: "Dr. Aisha Malik",
    role: "Dietitian",
    shift: "Morning",
    currentAssignment: "Reviewing ICU dietary plans",
    availability: "Available",
    avatar: "AM",
  },
  {
    id: "STF-005",
    name: "Tom Bradley",
    role: "Porter",
    shift: "Morning",
    currentAssignment: "Cart MC-003 – ICU delivery",
    availability: "Busy",
    avatar: "TB",
  },
  {
    id: "STF-006",
    name: "Lisa Chen",
    role: "Kitchen Assistant",
    shift: "Morning",
    currentAssignment: "Plating Station – breakfast portion control",
    availability: "Busy",
    avatar: "LC",
  },
  {
    id: "STF-007",
    name: "Chef Sofia Herrera",
    role: "Chef",
    shift: "Evening",
    currentAssignment: "Preparing for evening service handover",
    availability: "Available",
    avatar: "SH",
  },
  {
    id: "STF-008",
    name: "Ryan O'Brien",
    role: "Porter",
    shift: "Evening",
    currentAssignment: "Awaiting dispatch schedule",
    availability: "Available",
    avatar: "RO",
  },
  {
    id: "STF-009",
    name: "Supervisor Kate Wilson",
    role: "Supervisor",
    shift: "Morning",
    currentAssignment: "Quality control & HACCP checks",
    availability: "Busy",
    avatar: "KW",
  },
  {
    id: "STF-010",
    name: "Nurse Liaison Emma Bakker",
    role: "Dietitian",
    shift: "Evening",
    currentAssignment: "Patient dietary assessment – Pediatrics",
    availability: "On Break",
    avatar: "EB",
  },
];

// ============================================================
// EQUIPMENT (8)
// ============================================================
export const equipment: Equipment[] = [
  {
    id: "EQ-001",
    name: "Commercial Oven 1",
    location: "Main Kitchen",
    status: "Active",
    lastServiced: "2026-02-15",
    utilizationPercent: 78,
    nextMaintenance: "2026-04-15",
  },
  {
    id: "EQ-002",
    name: "Commercial Oven 2",
    location: "Main Kitchen",
    status: "Active",
    lastServiced: "2026-01-20",
    utilizationPercent: 64,
    nextMaintenance: "2026-03-20",
  },
  {
    id: "EQ-003",
    name: "Industrial Steamer",
    location: "Main Kitchen",
    status: "Active",
    lastServiced: "2026-03-01",
    utilizationPercent: 52,
    nextMaintenance: "2026-06-01",
  },
  {
    id: "EQ-004",
    name: "Blast Chiller 1",
    location: "Cold Storage",
    status: "Idle",
    lastServiced: "2026-02-28",
    utilizationPercent: 32,
    nextMaintenance: "2026-05-28",
  },
  {
    id: "EQ-005",
    name: "Blast Chiller 2",
    location: "Cold Storage",
    status: "Active",
    lastServiced: "2026-02-28",
    utilizationPercent: 48,
    nextMaintenance: "2026-05-28",
  },
  {
    id: "EQ-006",
    name: "Industrial Dishwasher",
    location: "Washing Area",
    status: "Active",
    lastServiced: "2026-02-20",
    utilizationPercent: 88,
    nextMaintenance: "2026-05-20",
  },
  {
    id: "EQ-007",
    name: "Flat-Top Grill",
    location: "Main Kitchen",
    status: "Maintenance",
    lastServiced: "2026-03-06",
    utilizationPercent: 0,
    nextMaintenance: "2026-03-08",
  },
  {
    id: "EQ-008",
    name: "Food Processor Array",
    location: "Prep Area",
    status: "Active",
    lastServiced: "2026-02-10",
    utilizationPercent: 42,
    nextMaintenance: "2026-05-10",
  },
];

// ============================================================
// MEAL CARTS (6)
// ============================================================
export const mealCarts: MealCart[] = [
  {
    id: "MC-001",
    assignedWard: "ICU",
    mealsLoaded: 12,
    capacity: 15,
    departureTime: "07:15",
    returnTime: "08:00",
    status: "Returned",
    assignedPorter: "Tom Bradley",
  },
  {
    id: "MC-002",
    assignedWard: "Ward A",
    mealsLoaded: 18,
    capacity: 20,
    departureTime: "07:30",
    returnTime: "08:30",
    status: "Returned",
    assignedPorter: "Ryan O'Brien",
  },
  {
    id: "MC-003",
    assignedWard: "ICU",
    mealsLoaded: 12,
    capacity: 15,
    departureTime: "12:00",
    returnTime: "12:45",
    status: "In Transit",
    assignedPorter: "Tom Bradley",
  },
  {
    id: "MC-004",
    assignedWard: "Ward B",
    mealsLoaded: 22,
    capacity: 24,
    departureTime: "12:15",
    returnTime: "13:00",
    status: "Loading",
    assignedPorter: "Ryan O'Brien",
  },
  {
    id: "MC-005",
    assignedWard: "Pediatrics",
    mealsLoaded: 0,
    capacity: 12,
    departureTime: "12:30",
    returnTime: "13:15",
    status: "Available",
    assignedPorter: "Unassigned",
  },
  {
    id: "MC-006",
    assignedWard: "Ward A",
    mealsLoaded: 0,
    capacity: 20,
    departureTime: "18:00",
    returnTime: "19:00",
    status: "Available",
    assignedPorter: "Unassigned",
  },
];

// ============================================================
// WARD DELIVERIES (8)
// ============================================================
export const wardDeliveries: WardDelivery[] = [
  {
    id: "DEL-001",
    ward: "ICU",
    assignedCart: "MC-003",
    scheduledTime: "12:00",
    actualTime: "12:05",
    mealsCount: 12,
    status: "In Transit",
    patients: [
      "PT-001 Margaret Chen",
      "PT-002 Robert Okonkwo",
      "PT-003 Priya Sharma",
      "PT-016 Thomas Bergmann",
    ],
  },
  {
    id: "DEL-002",
    ward: "Ward A",
    assignedCart: "MC-002",
    scheduledTime: "07:30",
    actualTime: "07:28",
    mealsCount: 18,
    status: "Delivered",
    patients: [
      "PT-004 James Holloway",
      "PT-005 Fatima Al-Hassan",
      "PT-006 David Brennan",
      "PT-007 Amelia Thompson",
      "PT-017 Isabella Moreau",
      "PT-019 Yuki Tanaka",
    ],
  },
  {
    id: "DEL-003",
    ward: "Ward B",
    assignedCart: "MC-004",
    scheduledTime: "12:15",
    actualTime: "12:42",
    mealsCount: 22,
    status: "Delayed",
    patients: [
      "PT-008 Chen Wei-Lin",
      "PT-009 Natalie Russo",
      "PT-010 Marcus Williams",
      "PT-011 Sophie Laurent",
      "PT-018 Alexander Kim",
    ],
  },
  {
    id: "DEL-004",
    ward: "Pediatrics",
    assignedCart: "MC-005",
    scheduledTime: "12:30",
    actualTime: "",
    mealsCount: 18,
    status: "Pending",
    patients: [
      "PT-012 Oliver Kowalski",
      "PT-013 Emma Rodriguez",
      "PT-014 Noah Patel",
      "PT-015 Grace Adeyemi",
      "PT-020 Elizabeth Owusu",
    ],
  },
  {
    id: "DEL-005",
    ward: "Cardiology",
    assignedCart: "MC-002",
    scheduledTime: "07:45",
    actualTime: "07:50",
    mealsCount: 14,
    status: "Delivered",
    patients: ["Cardiology Ward Patients (14)"],
  },
  {
    id: "DEL-006",
    ward: "Oncology",
    assignedCart: "MC-001",
    scheduledTime: "07:15",
    actualTime: "07:22",
    mealsCount: 10,
    status: "Delivered",
    patients: ["Oncology Ward Patients (10)"],
  },
  {
    id: "DEL-007",
    ward: "Orthopedics",
    assignedCart: "MC-006",
    scheduledTime: "18:00",
    actualTime: "",
    mealsCount: 16,
    status: "Pending",
    patients: ["Orthopedics Ward Patients (16)"],
  },
  {
    id: "DEL-008",
    ward: "Neurology",
    assignedCart: "MC-006",
    scheduledTime: "18:15",
    actualTime: "",
    mealsCount: 13,
    status: "Pending",
    patients: ["Neurology Ward Patients (13)"],
  },
];

// ============================================================
// ACTIVITY FEED
// ============================================================
export const activityFeed: ActivityEvent[] = [
  {
    id: "ACT-001",
    type: "ai_alert",
    message:
      "AI: Allergen cross-contamination risk flagged for PT-020 (Prep Station 2)",
    timestamp: "14:48",
    severity: "critical",
  },
  {
    id: "ACT-002",
    type: "ai_alert",
    message: "AI: Renal diet potassium violation detected – PT-002, PT-017",
    timestamp: "14:15",
    severity: "critical",
  },
  {
    id: "ACT-003",
    type: "cart_dispatched",
    message: "Cart MC-003 dispatched to ICU with 12 meals",
    timestamp: "12:05",
    severity: "info",
  },
  {
    id: "ACT-004",
    type: "dietary_flag",
    message: "Dietitian flagged soy content in PT-009 dinner order",
    timestamp: "11:58",
    severity: "warning",
  },
  {
    id: "ACT-005",
    type: "meal_prepared",
    message: "Lunch batch for Ward A (18 meals) preparation completed",
    timestamp: "11:45",
    severity: "info",
  },
  {
    id: "ACT-006",
    type: "restock_alert",
    message: "Fresh Spinach stock below critical level (2.1 kg / 6 kg par)",
    timestamp: "11:30",
    severity: "warning",
  },
  {
    id: "ACT-007",
    type: "delivery_completed",
    message: "Ward A breakfast delivery confirmed delivered – 18/18 meals",
    timestamp: "08:30",
    severity: "info",
  },
  {
    id: "ACT-008",
    type: "meal_prepared",
    message: "ICU breakfast batch prepared – 12 special diet meals",
    timestamp: "07:10",
    severity: "info",
  },
  {
    id: "ACT-009",
    type: "restock_alert",
    message: "Chicken breast critically low (4.2 kg) — reorder triggered",
    timestamp: "07:02",
    severity: "critical",
  },
  {
    id: "ACT-010",
    type: "staff_update",
    message: "Morning shift team (6 staff) clocked in. All stations active.",
    timestamp: "06:00",
    severity: "info",
  },
];

// ============================================================
// CHART DATA - Meals produced per hour (last 8 hours)
// ============================================================
export const mealsPerHourData = [
  { hour: "07:00", meals: 42, target: 45 },
  { hour: "08:00", meals: 38, target: 40 },
  { hour: "09:00", meals: 22, target: 20 },
  { hour: "10:00", meals: 18, target: 18 },
  { hour: "11:00", meals: 56, target: 55 },
  { hour: "12:00", meals: 64, target: 65 },
  { hour: "13:00", meals: 48, target: 50 },
  { hour: "14:00", meals: 32, target: 30 },
];

// ============================================================
// STATION STATUS
// ============================================================
export const kitchenStations = [
  {
    id: "STATION-1",
    name: "Prep Station",
    status: "Active" as StationStatus,
    load: 72,
    currentTask: "Vegetable mise en place for dinner",
    staff: 2,
  },
  {
    id: "STATION-2",
    name: "Cooking Station",
    status: "Active" as StationStatus,
    load: 88,
    currentTask: "Protein batch – chicken & fish for lunch",
    staff: 2,
  },
  {
    id: "STATION-3",
    name: "Plating Station",
    status: "Alert" as StationStatus,
    load: 95,
    currentTask: "BOTTLENECK – Lunch plating queue backed up",
    staff: 1,
  },
  {
    id: "STATION-4",
    name: "Dispatch",
    status: "Active" as StationStatus,
    load: 45,
    currentTask: "Cart MC-004 loading for Ward B",
    staff: 1,
  },
];

// ============================================================
// KPI DATA
// ============================================================
export const kpiData = {
  mealsServedToday: 247,
  kitchenThroughput: 32,
  onTimeDeliveryPercent: 82,
  wasteReductionPercent: 14,
  totalPatientsToday: 103,
  activeAlerts: 3,
};
