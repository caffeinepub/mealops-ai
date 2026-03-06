# MealOps AI

## Current State
- Dashboard: static KPI cards (Meals Served Today, Kitchen Throughput, On-Time Delivery, Waste Reduction), kitchen stations, activity feed, meals-per-hour chart — all reading from static `kpiData` constants in `mockData.ts`
- Meal Planning: full CRUD for patients per ward (add/remove patients), table and by-ward views; patient data managed in component state
- Resource Tracking: static read-only tabs for Ingredients, Staff, Equipment, Meal Carts from `mockData.ts` constants
- Delivery Tracking: static read-only table from `wardDeliveries` constant; expandable rows, ward detail modal

## Requested Changes (Diff)

### Add
- **Dashboard**: Edit KPI values inline — each KPI card (Meals Served Today, Number of Patients, Kitchen Throughput, On-Time Delivery, Waste Reduction, Meals Produced Per Hour target) gets an edit button or inline editable field that allows the user to update the numeric value; changes persist in component state
- **Resource Tracking – Ingredients**: Add and remove ingredient rows (add dialog with fields: Name, Category, Stock Level, Par Level, Unit, Last Restocked; remove button per row with confirmation)
- **Resource Tracking – Staff**: Add and remove staff members (add dialog with fields: Name, Role, Shift, Current Assignment, Availability; remove button per card with confirmation)
- **Resource Tracking – Equipment**: Add and remove equipment items (add dialog with fields: Name, Location, Status, Utilization %, Last Serviced, Next Maintenance; remove button per card with confirmation)
- **Resource Tracking – Meal Carts**: Add and remove meal carts (add dialog with fields: Cart ID, Assigned Ward, Meals Loaded, Capacity, Departure Time, Return Time, Porter, Status; remove button per row with confirmation)
- **Delivery Tracking**: Add and remove delivery rows (add dialog with fields: Ward, Cart, Scheduled Time, Actual/ETA, Meals Count, Status; remove button per row with confirmation); state managed in component, not from static constant
- **Delivery Tracking – Live Cart Tracker**: Below the delivery table, add a visual "Live Cart Movement" panel showing each in-transit/pending cart as a node moving along a route between Kitchen -> [Ward Name]. Animate the node position based on status (Pending = at kitchen, In Transit = midway animated, Delivered = at ward end). This is a simple SVG/CSS animation panel, not a real map.

### Modify
- **Dashboard KPIs**: Convert `kpiData` object to React `useState` in `DashboardPage` so edits persist in session; add a small edit icon per KPI card that opens an inline input or small popover to update the value
- **Meal Planning**: Already editable (add/remove patients) — no change needed structurally, but add a "Number of Patients" counter derived live from `patientList.length` synced with dashboard KPI if possible
- **Resource Tracking**: All four tabs (Ingredients, Staff, Equipment, Carts) must become stateful — move data to `useState` inside `ResourceTrackingPage`, remove direct imports of static arrays for display; add an "+ Add" button per tab
- **Delivery Tracking**: Move `wardDeliveries` to `useState` inside `DeliveryTrackingPage`; add "+ Add Delivery" button; add remove button per row

### Remove
- Nothing removed

## Implementation Plan
1. **DashboardPage.tsx**: Move `kpiData` to `useState`. Add an `EditKPIDialog` or inline edit popover triggered by a pencil icon on each KPI card. Fields: numeric input for value. Show toast on save.
2. **ResourceTrackingPage.tsx**: 
   - Move `ingredients`, `staff`, `equipment`, `mealCarts` to `useState` 
   - Add an "+ Add [Resource]" button in each tab header
   - Add `AddIngredientDialog`, `AddStaffDialog`, `AddEquipmentDialog`, `AddCartDialog` 
   - Add remove button per row/card with `AlertDialog` confirmation
   - Low-stock badge counts update reactively
3. **DeliveryTrackingPage.tsx**: 
   - Move `wardDeliveries` to `useState`
   - Add "+ Add Delivery" button with `AddDeliveryDialog` (Ward, Cart, Scheduled, Actual/ETA, Meals, Status)
   - Add remove button per row with `AlertDialog` confirmation
   - Add "Live Cart Tracker" section below table: SVG or flexbox route visualization showing Kitchen -> Ward path; each cart shown as a labeled dot animated along the path based on status
4. **data/mockData.ts**: No changes needed (data is already exported and will be used as initial state)
