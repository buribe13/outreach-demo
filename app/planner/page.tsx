"use client";

/**
 * OUTREACH WINDOW PLANNER - Main Planner Page
 *
 * The primary timeline-based interface for planning outreach.
 * TIME is the dominant dimension here.
 */

import { useEffect, useState, useCallback } from "react";
import { format, addDays, startOfDay, endOfDay } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Timeline } from "@/components/planner/Timeline";
import { GuidancePanel } from "@/components/planner/GuidancePanel";
import { OverlapViewer } from "@/components/planner/OverlapViewer";
import { AddSignalDialog } from "@/components/planner/AddSignalDialog";
import { Calendar, Plus, Download, Upload, RefreshCw } from "lucide-react";
import type { SignalsApiResponse, Signal } from "@/lib/types";
import { getAllSignals, filterSignalsByDateRange } from "@/lib/mock/signals";
import { computeWindows, detectSignalOverlaps } from "@/lib/windowing";

// Local storage key for custom signals
const CUSTOM_SIGNALS_KEY = "outreach-window-custom-signals";

// Demo custom signals - pre-populated for demo purposes
const getDemoCustomSignals = (): Signal[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const setTime = (date: Date, hours: number, minutes: number = 0): Date => {
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  };

  return [
    {
      id: "demo-custom-1",
      signalType: "custom" as const,
      title: "Team Alpha Morning Shift",
      description:
        "Morning outreach team covering Wilshire corridor. 3 volunteers confirmed.",
      timeRange: {
        start: setTime(addDays(today, 0), 9).toISOString(),
        end: setTime(addDays(today, 0), 13).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Scheduled outreach shift. Team lead: Maria G. Focus area: tent encampments near Wilshire/Vermont.",
      areaContext: "Koreatown - Wilshire Corridor",
      isCustom: true,
    },
    {
      id: "demo-custom-2",
      signalType: "custom" as const,
      title: "Resource Distribution Run",
      description:
        "Distributing hygiene kits and water bottles in Olympic area.",
      timeRange: {
        start: setTime(addDays(today, 0), 14).toISOString(),
        end: setTime(addDays(today, 0), 17).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Supplies: 50 hygiene kits, 100 water bottles, 30 blankets. Contact: operations@outreach.org",
      areaContext: "Koreatown - Olympic Blvd",
      isCustom: true,
    },
    {
      id: "demo-custom-3",
      signalType: "shelterHours" as const,
      title: "Partner Org Coordination Meeting",
      description:
        "Weekly coordination call with LAHSA and partner organizations.",
      timeRange: {
        start: setTime(addDays(today, 1), 10).toISOString(),
        end: setTime(addDays(today, 1), 11).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Zoom meeting. Agenda: territory coordination, resource sharing, upcoming events.",
      areaContext: "Virtual",
      isCustom: true,
    },
    {
      id: "demo-custom-4",
      signalType: "custom" as const,
      title: "Team Beta Evening Outreach",
      description:
        "Evening shift covering Vermont Avenue area. 4 volunteers, 2 case workers.",
      timeRange: {
        start: setTime(addDays(today, 1), 17).toISOString(),
        end: setTime(addDays(today, 1), 21).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Evening outreach focused on connecting with community members after work hours. Team lead: James K.",
      areaContext: "Koreatown - Vermont Corridor",
      isCustom: true,
    },
    {
      id: "demo-custom-5",
      signalType: "publicEvent" as const,
      title: "Mobile Health Clinic - MacArthur Park",
      description:
        "Free health screenings, vaccinations, and resource connections.",
      timeRange: {
        start: setTime(addDays(today, 2), 10).toISOString(),
        end: setTime(addDays(today, 2), 15).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Partnering with LA County Health. Great opportunity for coordinated outreach. Contact: health@outreach.org",
      areaContext: "MacArthur Park",
      isCustom: true,
    },
    {
      id: "demo-custom-6",
      signalType: "custom" as const,
      title: "Housing Navigation Workshop",
      description:
        "Workshop on housing applications and voucher programs. 20 spots available.",
      timeRange: {
        start: setTime(addDays(today, 2), 13).toISOString(),
        end: setTime(addDays(today, 2), 15).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Held at community center. Pre-registration recommended. Materials provided.",
      areaContext: "Koreatown - Community Center",
      isCustom: true,
    },
    {
      id: "demo-custom-7",
      signalType: "custom" as const,
      title: "Weekend Resource Distribution",
      description:
        "Large-scale distribution: food, clothing, and essential supplies.",
      timeRange: {
        start: setTime(addDays(today, 3), 9).toISOString(),
        end: setTime(addDays(today, 3), 13).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Major distribution event. 8 volunteers needed. Setup begins at 8am. Location: parking lot at 6th & Normandie.",
      areaContext: "Koreatown - 6th & Normandie",
      isCustom: true,
    },
    {
      id: "demo-custom-8",
      signalType: "serviceBottleneck" as const,
      title: "DMV Mobile Unit Visit",
      description:
        "Mobile DMV unit providing ID services. Expected high demand.",
      timeRange: {
        start: setTime(addDays(today, 3), 10).toISOString(),
        end: setTime(addDays(today, 3), 16).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "medium" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "High demand expected. Good opportunity to help community members prepare documents beforehand.",
      areaContext: "Koreatown - Vermont/Wilshire",
      isCustom: true,
    },
    {
      id: "demo-custom-9",
      signalType: "custom" as const,
      title: "Team Gamma Midday Shift",
      description:
        "Midday outreach covering 8th Street area. Focus on case management follow-ups.",
      timeRange: {
        start: setTime(addDays(today, 4), 11).toISOString(),
        end: setTime(addDays(today, 4), 15).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Follow-up visits with clients. Team includes 2 case managers. Vehicle available for transport.",
      areaContext: "Koreatown - 8th Street",
      isCustom: true,
    },
    {
      id: "demo-custom-10",
      signalType: "custom" as const,
      title: "Volunteer Training Session",
      description:
        "New volunteer orientation and safety training. Required for all new team members.",
      timeRange: {
        start: setTime(addDays(today, 5), 10).toISOString(),
        end: setTime(addDays(today, 5), 13).toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided" as const,
        lastUpdated: now.toISOString(),
      },
      impactLevel: "low" as const,
      confidenceLevel: "high" as const,
      interpretationNotes:
        "Training covers harm reduction principles, de-escalation, and resource navigation. Lunch provided.",
      areaContext: "Koreatown - Office",
      isCustom: true,
    },
  ];
};

export default function PlannerPage() {
  const [data, setData] = useState<SignalsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"1d" | "7d" | "30d">("7d");
  const [scenarioMode, setScenarioMode] = useState(false);
  const [customSignals, setCustomSignals] = useState<Signal[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);

  // Load custom signals from localStorage or use demo data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_SIGNALS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.customSignals && parsed.customSignals.length > 0) {
          setCustomSignals(parsed.customSignals);
        } else {
          // Use demo data if no custom signals
          setCustomSignals(getDemoCustomSignals());
        }
      } else {
        // Use demo data on first load
        setCustomSignals(getDemoCustomSignals());
      }
    } catch (e) {
      console.error("Failed to load custom signals:", e);
      setCustomSignals(getDemoCustomSignals());
    }
  }, []);

  // Save custom signals to localStorage
  const saveCustomSignals = useCallback((signals: Signal[]) => {
    try {
      localStorage.setItem(
        CUSTOM_SIGNALS_KEY,
        JSON.stringify({
          customSignals: signals,
          lastModified: new Date().toISOString(),
          version: 1,
        })
      );
      setCustomSignals(signals);
    } catch (e) {
      console.error("Failed to save custom signals:", e);
    }
  }, []);

  // Compute data locally
  const calculateData = useCallback(() => {
    setLoading(true);
    try {
      const now = new Date();
      const days = dateRange === "1d" ? 1 : dateRange === "7d" ? 7 : 30;
      const start = startOfDay(now);
      const end = endOfDay(addDays(now, days));

      // Get signals (simulated/delayed only)
      const allBaseSignals = getAllSignals(scenarioMode);
      const filteredSignals = filterSignalsByDateRange(
        allBaseSignals,
        start,
        end
      );

      // Compute windows and overlaps
      const windows = computeWindows(filteredSignals, start, end);
      const overlaps = detectSignalOverlaps(filteredSignals);

      setData({
        signals: filteredSignals,
        overlaps,
        windows,
        meta: {
          queryRange: {
            start: start.toISOString(),
            end: end.toISOString(),
          },
          scenarioMode,
          generatedAt: new Date().toISOString(),
          disclaimer:
            "PROTOTYPE DATA: All signals are simulated or based on delayed/public information. " +
            "This tool does not provide real-time data, enforcement information, or individual tracking. " +
            "Use for organizational planning purposes only. Verify conditions before outreach activities.",
        },
      });
    } catch (error) {
      console.error("Failed to compute signals:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, scenarioMode]);

  useEffect(() => {
    calculateData();
  }, [calculateData]);

  // Merge custom signals with API data
  const allSignals = data ? [...data.signals, ...customSignals] : customSignals;

  // Handle adding a custom signal
  const handleAddSignal = (signal: Signal) => {
    const newSignals = [...customSignals, { ...signal, isCustom: true }];
    saveCustomSignals(newSignals);
  };

  // Handle removing a custom signal
  const handleRemoveCustomSignal = (signalId: string) => {
    const newSignals = customSignals.filter((s) => s.id !== signalId);
    saveCustomSignals(newSignals);
  };

  // Export custom signals
  const handleExport = () => {
    const exportData = {
      customSignals,
      exportedAt: new Date().toISOString(),
      version: 1,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outreach-planner-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import custom signals
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        if (imported.customSignals && Array.isArray(imported.customSignals)) {
          const merged = [...customSignals, ...imported.customSignals];
          // Dedupe by id
          const unique = merged.filter(
            (s, i, arr) => arr.findIndex((x) => x.id === s.id) === i
          );
          saveCustomSignals(unique);
        }
      } catch (err) {
        console.error("Failed to import:", err);
        alert("Failed to import file. Please check the format.");
      }
    };
    input.click();
  };

  const selectedWindowData = data?.windows.find((w) => w.id === selectedWindow);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4 space-y-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Outreach Planner
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Timeline view of outreach windows. Click a window for guidance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AddSignalDialog onAdd={handleAddSignal} />

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>

            <Button variant="outline" size="sm" onClick={calculateData}>
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Date Range Tabs */}
            <Tabs
              value={dateRange}
              onValueChange={(v) => setDateRange(v as typeof dateRange)}
            >
              <TabsList>
                <TabsTrigger value="1d">1d</TabsTrigger>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator orientation="vertical" className="h-6" />

            {/* Scenario Toggle */}
            <Button
              variant={scenarioMode ? "default" : "outline"}
              size="sm"
              onClick={() => setScenarioMode(!scenarioMode)}
              className={
                scenarioMode
                  ? "bg-[oklch(0.7_0.12_70)] hover:bg-[oklch(0.65_0.12_70)]"
                  : ""
              }
            >
              {scenarioMode ? "Scenario Mode ON" : "Scenario Mode"}
            </Button>
          </div>

          {/* Date Display */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(), "MMM d")} -{" "}
              {format(
                addDays(
                  new Date(),
                  dateRange === "1d" ? 1 : dateRange === "7d" ? 7 : 30
                ),
                "MMM d, yyyy"
              )}
            </span>
          </div>
        </div>

        {/* Scenario Warning */}
        {scenarioMode && (
          <div className="p-3 rounded-lg bg-[oklch(0.7_0.12_70)]/10 border border-[oklch(0.7_0.12_70)]/30">
            <p className="text-sm text-[oklch(0.7_0.12_70)]">
              <strong>Scenario Mode:</strong> Speculative mega-event signals
              (e.g., 2028 Olympics) are included. This is for planning exercises
              only. Actual conditions will differ.
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Timeline Panel */}
        <div className="flex-1 p-6 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : data ? (
            <Timeline
              windows={data.windows}
              signals={allSignals}
              selectedWindowId={selectedWindow}
              onSelectWindow={setSelectedWindow}
              customSignals={customSignals}
              onRemoveCustomSignal={handleRemoveCustomSignal}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Failed to load timeline data.
            </div>
          )}
        </div>

        {/* Right Panel - Guidance + Overlaps */}
        <div className="w-96 border-l border-border/50 flex flex-col">
          <Tabs defaultValue="guidance" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 w-auto">
              <TabsTrigger value="guidance">Guidance</TabsTrigger>
              <TabsTrigger value="overlaps">Overlaps</TabsTrigger>
            </TabsList>

            <TabsContent value="guidance" className="flex-1 overflow-auto p-4">
              <GuidancePanel
                selectedWindow={selectedWindowData}
                allWindows={data?.windows || []}
              />
            </TabsContent>

            <TabsContent value="overlaps" className="flex-1 overflow-auto p-4">
              <OverlapViewer overlaps={data?.overlaps || []} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
