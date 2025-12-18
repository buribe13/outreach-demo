'use client';

/**
 * OUTREACH WINDOW PLANNER - Guidance Panel
 * 
 * Provides contextual guidance for outreach coordinators.
 * 
 * ETHICAL NOTE:
 * This panel provides SUGGESTIONS, not prescriptions.
 * It does NOT include enforcement guidance.
 * Strategies are focused on harm reduction and coordination.
 */

import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lightbulb,
  Users,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import type { OutreachWindow, WindowStatus } from '@/lib/types';

// Strategy suggestions by window status
// These are intentionally harm-reduction focused
const strategiesByStatus: Record<WindowStatus, string[]> = {
  safer: [
    'Ideal time for in-depth conversations and relationship building',
    'Good opportunity for resource distribution',
    'Consider scheduled appointments or follow-ups',
    'Document needs and service connections for later follow-up',
  ],
  caution: [
    'Keep outreach activities flexible and mobile',
    'Have backup locations or timing in mind',
    'Prioritize quick check-ins over lengthy engagements',
    'Coordinate with partner organizations if in same area',
  ],
  avoid: [
    'Consider rescheduling non-urgent outreach',
    'If outreach is necessary, keep duration brief',
    'Focus on wellness checks rather than service enrollment',
    'Document conditions for future planning',
  ],
};

// General guidance notes (always displayed)
const generalNotes = [
  'Always prioritize the safety and dignity of community members',
  'Respect people\'s autonomy and choices',
  'Coordinate with other organizations to avoid duplication',
  'Document patterns for future planning without collecting personal data',
];

interface GuidancePanelProps {
  selectedWindow: OutreachWindow | undefined;
  allWindows: OutreachWindow[];
}

export function GuidancePanel({ selectedWindow, allWindows }: GuidancePanelProps) {
  // Find next safer window for recommendation
  const now = new Date();
  const nextSaferWindow = allWindows.find(w => {
    const start = new Date(w.timeRange.start);
    return start > now && w.status === 'safer';
  });

  // Status icon mapping
  const StatusIcon = selectedWindow?.status === 'safer' 
    ? CheckCircle2 
    : selectedWindow?.status === 'caution' 
      ? Clock 
      : AlertTriangle;

  return (
    <div className="space-y-6">
      {/* Selected Window Info */}
      {selectedWindow ? (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${
                selectedWindow.status === 'safer' 
                  ? 'text-[oklch(0.65_0.15_145)]'
                  : selectedWindow.status === 'caution'
                    ? 'text-[oklch(0.7_0.12_70)]'
                    : 'text-[oklch(0.6_0.12_25)]'
              }`} />
              <CardTitle className="text-base">Selected Window</CardTitle>
            </div>
            <CardDescription>
              {format(new Date(selectedWindow.timeRange.start), 'EEEE, MMM d')}
              <br />
              {format(new Date(selectedWindow.timeRange.start), 'h:mm a')} - {' '}
              {format(new Date(selectedWindow.timeRange.end), 'h:mm a')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Window annotation */}
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm">{selectedWindow.annotation}</p>
            </div>

            {/* Strategies for this window */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                Suggested Strategies
              </div>
              <ul className="space-y-2">
                {strategiesByStatus[selectedWindow.status].map((strategy, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contributing factors */}
            {selectedWindow.contributingSignals.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Why this rating?</div>
                <div className="space-y-1">
                  {selectedWindow.contributingSignals.map(signal => (
                    <div key={signal.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {signal.impactLevel}
                      </Badge>
                      <span className="truncate">{signal.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a window from the timeline to see guidance</p>
          </CardContent>
        </Card>
      )}

      {/* Next Safer Window Recommendation */}
      {nextSaferWindow && (
        <Card className="border-border/50 bg-[oklch(0.65_0.15_145)]/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[oklch(0.65_0.15_145)]" />
              <CardTitle className="text-sm">Next Safer Window</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="font-medium">
                {format(new Date(nextSaferWindow.timeRange.start), 'EEEE, MMM d')}
              </span>
              <br />
              <span className="text-muted-foreground">
                {format(new Date(nextSaferWindow.timeRange.start), 'h:mm a')} - {' '}
                {format(new Date(nextSaferWindow.timeRange.end), 'h:mm a')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* General Notes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          Coordinator Notes
        </div>
        <ul className="space-y-2">
          {generalNotes.map((note, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-1">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>

      {/* Ethical Reminder */}
      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-xs text-muted-foreground">
          <strong>Remember:</strong> This tool provides timing guidance only. 
          It does not track individuals, predict enforcement, or replace 
          direct community relationships.
        </p>
      </div>
    </div>
  );
}

