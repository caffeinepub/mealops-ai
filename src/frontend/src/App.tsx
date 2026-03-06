import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { AIRecommendationsPage } from "./pages/AIRecommendationsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DeliveryTrackingPage } from "./pages/DeliveryTrackingPage";
import { MealPlanningPage } from "./pages/MealPlanningPage";
import { ResourceTrackingPage } from "./pages/ResourceTrackingPage";

export type Page =
  | "dashboard"
  | "meal_planning"
  | "ai_recommendations"
  | "resource_tracking"
  | "delivery_tracking";
export type UserRole = "kitchen_staff" | "nurse";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [userRole, setUserRole] = useState<UserRole>("kitchen_staff");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userRole={userRole}
        onRoleChange={setUserRole}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          currentPage={currentPage}
          userRole={userRole}
          onMenuToggle={() => setSidebarCollapsed((p) => !p)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {currentPage === "dashboard" && <DashboardPage />}
          {currentPage === "meal_planning" && <MealPlanningPage />}
          {currentPage === "ai_recommendations" && <AIRecommendationsPage />}
          {currentPage === "resource_tracking" && <ResourceTrackingPage />}
          {currentPage === "delivery_tracking" && <DeliveryTrackingPage />}
        </main>
      </div>
      <Toaster richColors theme="dark" position="top-right" />
    </div>
  );
}
