'use client';

/**
 * OUTREACH WINDOW PLANNER - Timeline Component
 * 
 * TIME is the dominant dimension.
 * This is a vertical timeline showing outreach windows.
 * Each block represents a 2-hour window with its status.
 */

import React from 'react';
import { format, isSameDay, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  ChevronRight,
} from 'lucide-react';
import type { OutreachWindow, Signal, WindowStatus } from '@/lib/types';

const statusConfig: Record<WindowStatus, {
  label: string;
  icon: React.ElementType;
  className: string;
  bgClassName: string;
}> = {
  safer: {
    label: 'Safer Window',
    icon: CheckCircle2,
    className: 'text-[oklch(0.65_0.15_145)]',
    bgClassName: 'bg-[oklch(0.65_0.15_145)]/10 border-[oklch(0.65_0.15_145)]/30 hover:bg-[oklch(0.65_0.15_145)]/20',
  },
  caution: {
    label: 'Use Caution',
    icon: Clock,
    className: 'text-[oklch(0.7_0.12_70)]',
    bgClassName: 'bg-[oklch(0.7_0.12_70)]/10 border-[oklch(0.7_0.12_70)]/30 hover:bg-[oklch(0.7_0.12_70)]/20',
  },
  avoid: {
    label: 'High Disruption',
    icon: AlertTriangle,
    className: 'text-[oklch(0.6_0.12_25)]',
    bgClassName: 'bg-[oklch(0.6_0.12_25)]/10 border-[oklch(0.6_0.12_25)]/30 hover:bg-[oklch(0.6_0.12_25)]/20',
  },
};

interface TimelineProps {
  windows: OutreachWindow[];
  signals: Signal[];
  selectedWindowId: string | null;
  onSelectWindow: (windowId: string | null) => void;
  customSignals: Signal[];
  onRemoveCustomSignal: (signalId: string) => void;
}

export function Timeline({
  windows,
  signals,
  selectedWindowId,
  onSelectWindow,
  customSignals,
  onRemoveCustomSignal,
}: TimelineProps) {
  // Group windows by day
  const windowsByDay = windows.reduce<Record<string, OutreachWindow[]>>((acc, window) => {
    const dateKey = format(new Date(window.timeRange.start), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(window);
    return acc;
  }, {});

  const days = Object.keys(windowsByDay).sort();

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <div key={status} className="flex items-center gap-2">
              <div className={cn('p-1 rounded', config.bgClassName, 'border')}>
                <Icon className={cn('h-3 w-3', config.className)} />
              </div>
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Custom Signals Section */}
      {customSignals.length > 0 && (
        <div className="p-4 rounded-lg border border-border/50 bg-card/50 space-y-3">
          <div className="text-sm font-medium">Your Custom Items ({customSignals.length})</div>
          <div className="space-y-2">
            {customSignals.map(signal => (
              <div 
                key={signal.id}
                className="flex items-center justify-between p-2 rounded-md bg-muted/50"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{signal.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(signal.timeRange.start), 'MMM d, h:mm a')} - 
                    {format(new Date(signal.timeRange.end), 'h:mm a')}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => onRemoveCustomSignal(signal.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline by Day */}
      {days.map(day => (
        <div key={day} className="space-y-3">
          {/* Day Header */}
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-foreground">
              {getDayLabel(day)}
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="text-xs text-muted-foreground">
              {windowsByDay[day].filter(w => w.status === 'safer').length} safer windows
            </div>
          </div>

          {/* Windows for this day */}
          <div className="grid gap-2">
            {windowsByDay[day].map(window => {
              const config = statusConfig[window.status];
              const Icon = config.icon;
              const isSelected = selectedWindowId === window.id;
              const startTime = new Date(window.timeRange.start);
              const endTime = new Date(window.timeRange.end);

              return (
                <button
                  key={window.id}
                  onClick={() => onSelectWindow(isSelected ? null : window.id)}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border transition-all duration-200',
                    config.bgClassName,
                    isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.className)} />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                          </span>
                          <Badge variant="outline" className={cn('text-xs', config.className)}>
                            Score: {window.score}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {window.annotation}
                        </p>
                        
                        {/* Contributing signals count */}
                        {window.contributingSignals.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {window.contributingSignals.length} signal{window.contributingSignals.length !== 1 ? 's' : ''} affecting this window
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ChevronRight className={cn(
                      'h-5 w-5 text-muted-foreground transition-transform shrink-0',
                      isSelected && 'rotate-90'
                    )} />
                  </div>

                  {/* Expanded details */}
                  {isSelected && window.contributingSignals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Contributing Signals:
                      </div>
                      {window.contributingSignals.map(signal => (
                        <div 
                          key={signal.id}
                          className="flex items-center justify-between text-sm p-2 rounded bg-background/50"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {signal.signalType}
                            </Badge>
                            <span className="truncate">{signal.title}</span>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary" className="text-xs">
                                {signal.impactLevel}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{signal.interpretationNotes}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {windows.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No windows to display for the selected period.
        </div>
      )}
    </div>
  );
}

