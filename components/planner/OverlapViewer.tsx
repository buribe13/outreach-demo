'use client';

/**
 * OUTREACH WINDOW PLANNER - Overlap Viewer
 * 
 * Shows when multiple disruptive signals overlap in time.
 * Provides plain-language explanations of why overlaps matter.
 */

import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Layers,
  AlertTriangle,
  Clock,
  Info,
} from 'lucide-react';
import type { SignalOverlap } from '@/lib/types';

interface OverlapViewerProps {
  overlaps: SignalOverlap[];
}

export function OverlapViewer({ overlaps }: OverlapViewerProps) {
  if (overlaps.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-8 text-center text-muted-foreground">
          <Layers className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No signal overlaps detected</p>
          <p className="text-xs mt-2">
            Overlaps occur when multiple medium or high-impact signals coincide
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort overlaps by start time
  const sortedOverlaps = [...overlaps].sort((a, b) => 
    new Date(a.timeRange.start).getTime() - new Date(b.timeRange.start).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Signal Overlaps ({overlaps.length})</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Periods where multiple disruptions coincide require extra attention.
        </p>
      </div>

      <Separator />

      {/* Overlaps List */}
      <div className="space-y-4">
        {sortedOverlaps.map(overlap => (
          <Card key={overlap.id} className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm">
                    {format(new Date(overlap.timeRange.start), 'EEEE, MMM d')}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(overlap.timeRange.start), 'h:mm a')} - {' '}
                    {format(new Date(overlap.timeRange.end), 'h:mm a')}
                  </CardDescription>
                </div>
                <Badge 
                  variant="outline"
                  className={`
                    ${overlap.combinedImpact === 'high' 
                      ? 'text-[oklch(0.6_0.12_25)] border-[oklch(0.6_0.12_25)]/30' 
                      : 'text-[oklch(0.7_0.12_70)] border-[oklch(0.7_0.12_70)]/30'}
                  `}
                >
                  {overlap.combinedImpact === 'high' && (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {overlap.combinedImpact} impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Overlapping signals */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Overlapping Signals:
                </div>
                {overlap.signals.map(signal => (
                  <div 
                    key={signal.id}
                    className="flex items-center gap-2 p-2 rounded bg-muted/50"
                  >
                    <Badge variant="outline" className="text-xs shrink-0">
                      {signal.signalType}
                    </Badge>
                    <span className="text-sm truncate">{signal.title}</span>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {overlap.explanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Why Overlaps Matter */}
      <Card className="border-border/50 bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Why Overlaps Matter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Multiple disruptions increase unpredictability
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Community members may face compounding pressures
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Outreach teams should have extra flexibility
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Consider enhanced coordination with partner orgs
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

