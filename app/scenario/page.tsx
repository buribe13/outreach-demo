'use client';

/**
 * OUTREACH WINDOW PLANNER - Scenario Mode Page
 * 
 * CLEARLY LABELED SPECULATIVE PLANNING
 * 
 * This page allows organizations to explore how outreach windows
 * might change during major events (e.g., 2028 Olympics).
 * 
 * ALL DATA HERE IS SPECULATIVE AND SIMULATED.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  Beaker,
  Calendar,
  TrendingDown,
  Clock,
  ArrowRight,
  Info,
  Trophy,
  Train,
  Shield,
} from 'lucide-react';
import type { SignalsApiResponse } from '@/lib/types';

export default function ScenarioPage() {
  const [normalData, setNormalData] = useState<SignalsApiResponse | null>(null);
  const [scenarioData, setScenarioData] = useState<SignalsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const now = new Date();
        const end = addDays(now, 30);
        const params = `start=${now.toISOString()}&end=${end.toISOString()}`;
        
        const [normalRes, scenarioRes] = await Promise.all([
          fetch(`/api/signals?${params}&scenario=off`),
          fetch(`/api/signals?${params}&scenario=on`),
        ]);
        
        const [normal, scenario] = await Promise.all([
          normalRes.json(),
          scenarioRes.json(),
        ]);
        
        setNormalData(normal);
        setScenarioData(scenario);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate comparison stats
  const normalStats = normalData ? {
    safer: normalData.windows.filter(w => w.status === 'safer').length,
    caution: normalData.windows.filter(w => w.status === 'caution').length,
    avoid: normalData.windows.filter(w => w.status === 'avoid').length,
    total: normalData.windows.length,
  } : null;

  const scenarioStats = scenarioData ? {
    safer: scenarioData.windows.filter(w => w.status === 'safer').length,
    caution: scenarioData.windows.filter(w => w.status === 'caution').length,
    avoid: scenarioData.windows.filter(w => w.status === 'avoid').length,
    total: scenarioData.windows.length,
  } : null;

  // Calculate changes
  const saferChange = normalStats && scenarioStats 
    ? scenarioStats.safer - normalStats.safer 
    : 0;
  const avoidChange = normalStats && scenarioStats 
    ? scenarioStats.avoid - normalStats.avoid 
    : 0;

  // Get mega-event signals
  const megaSignals = scenarioData?.signals.filter(s => s.signalType === 'megaEvent') || [];

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Warning Banner */}
      <div className="p-4 rounded-lg bg-[oklch(0.7_0.12_70)]/10 border border-[oklch(0.7_0.12_70)]/30">
        <div className="flex items-start gap-3">
          <Beaker className="h-5 w-5 text-[oklch(0.7_0.12_70)] mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="font-medium text-[oklch(0.7_0.12_70)]">
              Scenario Mode - Speculative Planning
            </div>
            <p className="text-sm text-muted-foreground">
              This page simulates how outreach windows might change during major events 
              like the 2028 Olympics. <strong>All data is hypothetical</strong> and for 
              planning exercises only. Actual conditions will differ significantly.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Beaker className="h-6 w-6" />
          Scenario Mode
        </h1>
        <p className="text-muted-foreground">
          Compare normal conditions vs. major event scenarios to plan ahead.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Normal Mode */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Normal Conditions
            </CardTitle>
            <CardDescription>
              Current 30-day window analysis without mega-events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {normalStats && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-[oklch(0.65_0.15_145)]/10">
                    <div className="text-2xl font-semibold text-[oklch(0.65_0.15_145)]">
                      {normalStats.safer}
                    </div>
                    <div className="text-xs text-muted-foreground">Safer Windows</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[oklch(0.7_0.12_70)]/10">
                    <div className="text-2xl font-semibold text-[oklch(0.7_0.12_70)]">
                      {normalStats.caution}
                    </div>
                    <div className="text-xs text-muted-foreground">Caution</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[oklch(0.6_0.12_25)]/10">
                    <div className="text-2xl font-semibold text-[oklch(0.6_0.12_25)]">
                      {normalStats.avoid}
                    </div>
                    <div className="text-xs text-muted-foreground">Avoid</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  {Math.round((normalStats.safer / normalStats.total) * 100)}% of windows are safer
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Scenario Mode */}
        <Card className="border-[oklch(0.7_0.12_70)]/30 bg-[oklch(0.7_0.12_70)]/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[oklch(0.7_0.12_70)]" />
              With Mega-Events
            </CardTitle>
            <CardDescription>
              Simulated conditions during Olympics-scale events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scenarioStats && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-[oklch(0.65_0.15_145)]/10">
                    <div className="text-2xl font-semibold text-[oklch(0.65_0.15_145)]">
                      {scenarioStats.safer}
                    </div>
                    <div className="text-xs text-muted-foreground">Safer Windows</div>
                    {saferChange !== 0 && (
                      <div className={`text-xs mt-1 ${saferChange < 0 ? 'text-[oklch(0.6_0.12_25)]' : 'text-[oklch(0.65_0.15_145)]'}`}>
                        {saferChange > 0 ? '+' : ''}{saferChange}
                      </div>
                    )}
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[oklch(0.7_0.12_70)]/10">
                    <div className="text-2xl font-semibold text-[oklch(0.7_0.12_70)]">
                      {scenarioStats.caution}
                    </div>
                    <div className="text-xs text-muted-foreground">Caution</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[oklch(0.6_0.12_25)]/10">
                    <div className="text-2xl font-semibold text-[oklch(0.6_0.12_25)]">
                      {scenarioStats.avoid}
                    </div>
                    <div className="text-xs text-muted-foreground">Avoid</div>
                    {avoidChange !== 0 && (
                      <div className={`text-xs mt-1 ${avoidChange > 0 ? 'text-[oklch(0.6_0.12_25)]' : 'text-[oklch(0.65_0.15_145)]'}`}>
                        {avoidChange > 0 ? '+' : ''}{avoidChange}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  {Math.round((scenarioStats.safer / scenarioStats.total) * 100)}% of windows are safer
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      {saferChange < 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-[oklch(0.6_0.12_25)]" />
              Impact Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-[oklch(0.6_0.12_25)]/10 border border-[oklch(0.6_0.12_25)]/30">
              <p className="text-sm">
                During mega-event scenarios, <strong>{Math.abs(saferChange)} fewer safer windows</strong> are 
                available for outreach. This represents a {normalStats ? Math.round((Math.abs(saferChange) / normalStats.safer) * 100) : 0}% 
                reduction in optimal outreach opportunities.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Organizations should plan for compressed windows and enhanced coordination during these periods.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mega-Event Signals */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Simulated Mega-Event Signals</CardTitle>
          <CardDescription>
            These speculative signals are included in scenario mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {megaSignals.map(signal => (
            <div key={signal.id} className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {signal.title.includes('Opening') ? (
                    <Trophy className="h-4 w-4 text-[oklch(0.7_0.12_70)]" />
                  ) : signal.title.includes('Transit') ? (
                    <Train className="h-4 w-4 text-[oklch(0.7_0.12_70)]" />
                  ) : (
                    <Shield className="h-4 w-4 text-[oklch(0.7_0.12_70)]" />
                  )}
                  <span className="font-medium">{signal.title}</span>
                </div>
                <Badge variant="outline" className="text-[oklch(0.7_0.12_70)] border-[oklch(0.7_0.12_70)]/30">
                  SPECULATIVE
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(signal.timeRange.start), 'MMM d')} - {format(new Date(signal.timeRange.end), 'MMM d')}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {signal.impactLevel} impact
                </Badge>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <p className="text-xs text-muted-foreground">{signal.interpretationNotes}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Planning Recommendations */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Scenario Planning Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium">1</span>
              </div>
              <div>
                <strong>Build relationships now:</strong> Establish strong connections with community members 
                before high-disruption periods, so trust is already in place.
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium">2</span>
              </div>
              <div>
                <strong>Coordinate with partners:</strong> Work with other organizations to avoid overlap 
                and maximize coverage during compressed windows.
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium">3</span>
              </div>
              <div>
                <strong>Document and advocate:</strong> Use scenario planning to advocate for policies 
                that protect vulnerable communities during major events.
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium">4</span>
              </div>
              <div>
                <strong>Prepare resources:</strong> Stockpile essential supplies and information packets 
                that can be quickly distributed during brief safer windows.
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Link to Planner */}
      <div className="flex justify-center">
        <Link href="/planner">
          <Button size="lg">
            Open Planner with Scenario Mode
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Research Context */}
      <Separator />
      <div className="text-xs text-muted-foreground space-y-2">
        <p className="font-medium">Research Context</p>
        <p>
          This scenario mode is designed to support research on the question: 
          <em>"Does Koreatown's transit-rich environment make it a hotspot for 
          mega-event–motivated displacement compared to transit-poor neighborhoods?"</em>
        </p>
        <p>
          By comparing normal vs. mega-event conditions, organizations can better 
          understand and prepare for temporal compression of outreach opportunities.
        </p>
      </div>
    </div>
  );
}

