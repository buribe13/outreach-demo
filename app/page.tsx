"use client";

/**
 * OUTREACH WINDOW PLANNER - Overview Page
 *
 * Dashboard summary showing:
 * - Current outreach window status
 * - Upcoming windows summary
 * - Active disruptions
 * - Quick navigation to planner
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, addDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarClock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import type { SignalsApiResponse, OutreachWindow } from "@/lib/types";

// Status colors matching our CSS custom properties
const statusConfig = {
  safer: {
    label: "Safer Window",
    color: "text-[oklch(0.65_0.15_145)]",
    bgColor: "bg-[oklch(0.65_0.15_145)]/10",
    borderColor: "border-[oklch(0.65_0.15_145)]/30",
    icon: CheckCircle2,
  },
  caution: {
    label: "Use Caution",
    color: "text-[oklch(0.7_0.12_70)]",
    bgColor: "bg-[oklch(0.7_0.12_70)]/10",
    borderColor: "border-[oklch(0.7_0.12_70)]/30",
    icon: Clock,
  },
  avoid: {
    label: "High Disruption",
    color: "text-[oklch(0.6_0.12_25)]",
    bgColor: "bg-[oklch(0.6_0.12_25)]/10",
    borderColor: "border-[oklch(0.6_0.12_25)]/30",
    icon: AlertTriangle,
  },
};

export default function OverviewPage() {
  const [data, setData] = useState<SignalsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const now = new Date();
        const end = addDays(now, 7);
        const res = await fetch(
          `/api/signals?start=${now.toISOString()}&end=${end.toISOString()}`
        );
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch signals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Find current and next windows
  const now = new Date();
  const currentWindow = data?.windows.find((w) => {
    const start = new Date(w.timeRange.start);
    const end = new Date(w.timeRange.end);
    return now >= start && now < end;
  });

  const nextSaferWindow = data?.windows.find((w) => {
    const start = new Date(w.timeRange.start);
    return start > now && w.status === "safer";
  });

  // Count windows by status
  const windowCounts = data?.windows.reduce(
    (acc, w) => {
      acc[w.status]++;
      return acc;
    },
    { safer: 0, caution: 0, avoid: 0 }
  ) || { safer: 0, caution: 0, avoid: 0 };

  // Active high-impact signals
  const activeHighImpact =
    data?.signals.filter((s) => {
      const start = new Date(s.timeRange.start);
      const end = new Date(s.timeRange.end);
      return s.impactLevel === "high" && now >= start && now < end;
    }) || [];

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarClock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Outreach Window Planner
            </h1>
            <p className="text-muted-foreground">
              Koreatown, Los Angeles • {format(now, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <Card className="border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">
                Plan your outreach around temporal patterns
              </p>
              <p className="text-sm text-muted-foreground">
                This tool identifies safer windows for community engagement
                based on sanitation schedules, public events, and service hours.
              </p>
            </div>
            <Link href="/planner">
              <Button>
                <CalendarClock className="h-4 w-4 mr-2" />
                Open Planner
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Current Status Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Current Window
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {format(now, "MMM d, h:mm a")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {currentWindow ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const config = statusConfig[currentWindow.status];
                  const Icon = config.icon;
                  return (
                    <>
                      <div
                        className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}
                      >
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div>
                        <div className={`font-medium ${config.color}`}>
                          {config.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Until{" "}
                          {format(
                            new Date(currentWindow.timeRange.end),
                            "h:mm a"
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentWindow.annotation}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Loading current window status...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Safer Windows */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Safer Windows (7 days)</CardDescription>
            <CardTitle className="text-3xl font-semibold text-[oklch(0.65_0.15_145)]">
              {windowCounts.safer}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              2-hour periods with low disruption scores
            </p>
          </CardContent>
        </Card>

        {/* Caution Windows */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Caution Windows</CardDescription>
            <CardTitle className="text-3xl font-semibold text-[oklch(0.7_0.12_70)]">
              {windowCounts.caution}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Moderate disruption - proceed with flexibility
            </p>
          </CardContent>
        </Card>

        {/* High Disruption */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>High Disruption Periods</CardDescription>
            <CardTitle className="text-3xl font-semibold text-[oklch(0.6_0.12_25)]">
              {windowCounts.avoid}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Consider alternative timing if possible
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Safer Window */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg font-medium">
                Next Safer Window
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextSaferWindow ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {format(
                        new Date(nextSaferWindow.timeRange.start),
                        "EEEE, MMM d"
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(
                        new Date(nextSaferWindow.timeRange.start),
                        "h:mm a"
                      )}{" "}
                      -{" "}
                      {format(
                        new Date(nextSaferWindow.timeRange.end),
                        "h:mm a"
                      )}
                    </div>
                  </div>
                  <Badge className="bg-[oklch(0.65_0.15_145)]/10 text-[oklch(0.65_0.15_145)] border-[oklch(0.65_0.15_145)]/30">
                    Score: {nextSaferWindow.score}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {nextSaferWindow.annotation}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                No safer windows in the next 7 days
              </p>
            )}
            <Link href="/planner">
              <Button variant="outline" className="w-full mt-2">
                <CalendarClock className="h-4 w-4 mr-2" />
                View Full Timeline
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Disruptions */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg font-medium">
                Active High-Impact Signals
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeHighImpact.length > 0 ? (
              activeHighImpact.slice(0, 3).map((signal) => (
                <div
                  key={signal.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <AlertTriangle className="h-4 w-4 text-[oklch(0.6_0.12_25)] mt-0.5 shrink-0" />
                  <div className="space-y-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {signal.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Until{" "}
                      {format(new Date(signal.timeRange.end), "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.65_0.15_145)]" />
                <span className="text-sm text-muted-foreground">
                  No active high-impact signals
                </span>
              </div>
            )}
            <Link href="/signals">
              <Button
                variant="ghost"
                className="w-full mt-2 text-muted-foreground"
              >
                View All Signals
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Overlaps Section */}
      {data?.overlaps && data.overlaps.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Signal Overlaps
            </CardTitle>
            <CardDescription>
              Periods where multiple disruptions coincide - pay extra attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.overlaps.slice(0, 3).map((overlap) => (
                <div
                  key={overlap.id}
                  className="p-4 rounded-lg border border-border/50 bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      {format(
                        new Date(overlap.timeRange.start),
                        "MMM d, h:mm a"
                      )}{" "}
                      - {format(new Date(overlap.timeRange.end), "h:mm a")}
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                      ${
                        overlap.combinedImpact === "high"
                          ? "text-[oklch(0.6_0.12_25)] border-[oklch(0.6_0.12_25)]/30"
                          : "text-[oklch(0.7_0.12_70)] border-[oklch(0.7_0.12_70)]/30"
                      }
                    `}
                    >
                      {overlap.combinedImpact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {overlap.explanation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Research Question */}
      <Card className="border-border/50 bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Research Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground italic">
            "Does Koreatown's transit-rich environment make it a hotspot for
            mega-event–motivated displacement compared to transit-poor
            neighborhoods?"
          </p>
          <p className="text-sm text-muted-foreground">
            This tool helps answer this question by modeling how temporal
            pressures (sanitation cycles, public events, transit disruptions)
            concentrate in transit-accessible areas, and how major events like
            the 2028 Olympics might amplify these patterns.
          </p>
          <Link href="/scenario">
            <Button variant="outline" size="sm">
              Explore Scenario Mode
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Separator />
      <Card className="border-[oklch(0.7_0.12_70)]/30 bg-[oklch(0.7_0.12_70)]/5">
        <CardContent className="py-4">
          <div className="space-y-3" id="ethics">
            <p className="font-medium text-sm">About This Tool</p>
            <p className="text-sm text-muted-foreground">
              The Outreach Window Planner helps organizations identify
              lower-disruption periods for outreach activities. It reframes
              displacement as a temporal coordination problem, focusing on{" "}
              <em>when</em> care can be delivered with less disruption.
            </p>
            <div className="p-3 rounded-lg bg-background/50 border border-border/50">
              <p className="text-sm">
                <strong>Ethical commitments:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>
                  • <strong>No real-time data</strong> — All signals are
                  simulated or from public calendars
                </li>
                <li>
                  • <strong>No enforcement tracking</strong> — We don't predict
                  or track law enforcement
                </li>
                <li>
                  • <strong>No individual surveillance</strong> — Zero personal
                  data collection
                </li>
                <li>
                  • <strong>Open coordination</strong> — Designed for
                  transparent multi-org planning
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
