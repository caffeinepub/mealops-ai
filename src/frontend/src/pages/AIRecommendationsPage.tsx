import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  CheckCircle,
  Clock,
  Package,
  ShieldCheck,
  TrendingDown,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type AIRecommendation,
  type RecommendationCategory,
  recommendations as initialRecs,
} from "../data/mockData";

type FilterTab = "All" | RecommendationCategory;

const categoryIcons: Record<
  RecommendationCategory,
  React.ComponentType<{ className?: string }>
> = {
  "Waste Reduction": TrendingDown,
  Speed: Zap,
  Compliance: ShieldCheck,
  Resource: Package,
};

const categoryColors: Record<RecommendationCategory, string> = {
  "Waste Reduction": "text-chart-5 bg-chart-5/10 border-chart-5/20",
  Speed: "text-chart-2 bg-chart-2/10 border-chart-2/20",
  Compliance: "text-chart-4 bg-chart-4/10 border-chart-4/20",
  Resource: "text-primary bg-primary/10 border-primary/20",
};

const severityConfig = {
  Critical: {
    badge:
      "bg-status-critical/15 text-status-critical border-status-critical/40",
    border: "border-status-critical/30",
    glow: "glow-critical",
    dot: "bg-status-critical",
  },
  Warning: {
    badge: "bg-status-warning/15 text-status-warning border-status-warning/40",
    border: "border-status-warning/30",
    glow: "",
    dot: "bg-status-warning",
  },
  Info: {
    badge: "bg-status-info/15 text-status-info border-status-info/40",
    border: "border-border",
    glow: "",
    dot: "bg-status-info",
  },
};

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 90
      ? "bg-status-ok"
      : value >= 75
        ? "bg-chart-2"
        : "bg-muted-foreground";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
        <span>CONFIDENCE</span>
        <span className="text-foreground">{value}%</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({
  rec,
  index,
  onApply,
  onDismiss,
}: {
  rec: AIRecommendation;
  index: number;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const sev = severityConfig[rec.severity];
  const Icon = categoryIcons[rec.category];

  if (rec.dismissed) {
    return (
      <div
        data-ocid={`recommendation.item.${index}`}
        className="p-3 rounded-lg border border-border/30 bg-card/40 opacity-40"
      >
        <div className="flex items-center gap-2">
          <XCircle className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground line-through">
            {rec.title}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto">
            Dismissed
          </span>
        </div>
      </div>
    );
  }

  if (rec.applied) {
    return (
      <div
        data-ocid={`recommendation.item.${index}`}
        className="p-3 rounded-lg border border-status-ok/20 bg-status-ok/5"
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-status-ok" />
          <span className="text-xs text-status-ok/80">{rec.title}</span>
          <span className="text-[10px] text-status-ok ml-auto">Applied ✓</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid={`recommendation.item.${index}`}
      className={cn(
        "rounded-lg border bg-card p-4 space-y-3 transition-all",
        sev.border,
        sev.glow,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2 rounded-lg border shrink-0",
            categoryColors[rec.category],
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              {rec.title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded border",
                  sev.badge,
                )}
              >
                {rec.severity}
              </span>
              <span
                className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded border",
                  categoryColors[rec.category],
                )}
              >
                {rec.category}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {rec.description}
          </p>
        </div>
      </div>

      {/* Confidence + Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ConfidenceBar value={rec.confidence} />
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-muted-foreground">
            ESTIMATED IMPACT
          </p>
          <p className="text-xs font-semibold text-foreground">{rec.impact}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatTime(rec.timestamp)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-ocid={`recommendation.dismiss.button.${index}`}
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-xs text-muted-foreground hover:text-status-critical hover:bg-status-critical/10"
            onClick={() => onDismiss(rec.id)}
          >
            Dismiss
          </Button>
          <Button
            data-ocid={`recommendation.apply_button.${index}`}
            size="sm"
            className={cn(
              "h-7 px-3 text-xs font-semibold",
              rec.severity === "Critical"
                ? "bg-status-critical/80 hover:bg-status-critical text-white"
                : "bg-primary/80 hover:bg-primary text-primary-foreground",
            )}
            onClick={() => onApply(rec.id)}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AIRecommendationsPage() {
  const [recs, setRecs] = useState(initialRecs);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const handleApply = (id: string) => {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applied: true } : r)),
    );
    toast.success("Recommendation applied", {
      description: "Action has been queued for the kitchen team.",
    });
  };

  const handleDismiss = (id: string) => {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, dismissed: true } : r)),
    );
    toast.info("Recommendation dismissed");
  };

  const tabs: FilterTab[] = [
    "All",
    "Waste Reduction",
    "Speed",
    "Compliance",
    "Resource",
  ];

  const filteredRecs = recs.filter(
    (r) => activeTab === "All" || r.category === activeTab,
  );

  const counts = {
    All: recs.filter((r) => !r.dismissed && !r.applied).length,
    "Waste Reduction": recs.filter(
      (r) => r.category === "Waste Reduction" && !r.dismissed && !r.applied,
    ).length,
    Speed: recs.filter(
      (r) => r.category === "Speed" && !r.dismissed && !r.applied,
    ).length,
    Compliance: recs.filter(
      (r) => r.category === "Compliance" && !r.dismissed && !r.applied,
    ).length,
    Resource: recs.filter(
      (r) => r.category === "Resource" && !r.dismissed && !r.applied,
    ).length,
  };

  const criticalCount = recs.filter(
    (r) => r.severity === "Critical" && !r.dismissed && !r.applied,
  ).length;

  return (
    <div
      data-ocid="ai_recommendations.page"
      className="p-4 md:p-6 space-y-4 max-w-screen-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              AI Recommendations
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {counts.All} active recommendations · {criticalCount} critical
          </p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <Badge className="bg-status-critical/15 text-status-critical border border-status-critical/40 text-xs animate-pulse-slow">
              {criticalCount} CRITICAL
            </Badge>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList className="bg-muted/50 border border-border h-8">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              data-ocid={"ai_recommendations.filter.tab"}
              className="text-xs h-6 px-3 data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              {tab}
              {counts[tab] > 0 && (
                <span className="ml-1.5 text-[9px] font-mono bg-muted/80 text-muted-foreground px-1 rounded">
                  {counts[tab]}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-3">
            {filteredRecs.length === 0 && (
              <div
                data-ocid="ai_recommendations.empty_state"
                className="text-center py-12"
              >
                <BrainCircuit className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No recommendations in this category
                </p>
              </div>
            )}
            {filteredRecs.map((rec, idx) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                index={idx + 1}
                onApply={handleApply}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
