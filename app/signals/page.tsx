'use client';

/**
 * OUTREACH WINDOW PLANNER - Signals Page
 * 
 * Browse and filter all temporal signals.
 * Provides detailed view of what's affecting outreach windows.
 */

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Info,
  Truck,
  PartyPopper,
  Home,
  Train,
  Users,
  Wrench,
  Trophy,
  Tag,
} from 'lucide-react';
import type { Signal, SignalType, ImpactLevel } from '@/lib/types';

// Signal type icons and labels
const signalTypeConfig: Record<SignalType, { icon: React.ElementType; label: string; color: string }> = {
  sanitation: { icon: Truck, label: 'Sanitation', color: 'text-blue-400' },
  publicEvent: { icon: PartyPopper, label: 'Public Event', color: 'text-purple-400' },
  shelterHours: { icon: Home, label: 'Shelter Hours', color: 'text-green-400' },
  transitDisruption: { icon: Train, label: 'Transit', color: 'text-orange-400' },
  serviceBottleneck: { icon: Users, label: 'Service Bottleneck', color: 'text-yellow-400' },
  infrastructureWork: { icon: Wrench, label: 'Infrastructure', color: 'text-gray-400' },
  megaEvent: { icon: Trophy, label: 'Mega Event', color: 'text-red-400' },
  custom: { icon: Tag, label: 'Custom', color: 'text-cyan-400' },
};

const impactConfig: Record<ImpactLevel, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-[oklch(0.65_0.15_145)]/10 text-[oklch(0.65_0.15_145)] border-[oklch(0.65_0.15_145)]/30' },
  medium: { label: 'Medium', className: 'bg-[oklch(0.7_0.12_70)]/10 text-[oklch(0.7_0.12_70)] border-[oklch(0.7_0.12_70)]/30' },
  high: { label: 'High', className: 'bg-[oklch(0.6_0.12_25)]/10 text-[oklch(0.6_0.12_25)] border-[oklch(0.6_0.12_25)]/30' },
};

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<SignalType | 'all'>('all');
  const [impactFilter, setImpactFilter] = useState<ImpactLevel | 'all'>('all');

  useEffect(() => {
    async function fetchSignals() {
      try {
        const now = new Date();
        const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const res = await fetch(
          `/api/signals?start=${now.toISOString()}&end=${end.toISOString()}&scenario=on`
        );
        const json = await res.json();
        setSignals(json.signals);
      } catch (error) {
        console.error('Failed to fetch signals:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSignals();
  }, []);

  // Filter signals
  const filteredSignals = signals.filter(signal => {
    const matchesSearch = searchQuery === '' || 
      signal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signal.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || signal.signalType === typeFilter;
    const matchesImpact = impactFilter === 'all' || signal.impactLevel === impactFilter;
    
    return matchesSearch && matchesType && matchesImpact;
  });

  // Group by type for the tabs view
  const signalsByType = signals.reduce<Record<SignalType, Signal[]>>((acc, signal) => {
    if (!acc[signal.signalType]) acc[signal.signalType] = [];
    acc[signal.signalType].push(signal);
    return acc;
  }, {} as Record<SignalType, Signal[]>);

  // Count by impact
  const countByImpact = {
    high: signals.filter(s => s.impactLevel === 'high').length,
    medium: signals.filter(s => s.impactLevel === 'medium').length,
    low: signals.filter(s => s.impactLevel === 'low').length,
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Signals</h1>
        <p className="text-muted-foreground">
          Browse temporal signals affecting outreach windows. All data is simulated or public.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold">{signals.length}</div>
            <div className="text-sm text-muted-foreground">Total Signals</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-[oklch(0.6_0.12_25)]">{countByImpact.high}</div>
            <div className="text-sm text-muted-foreground">High Impact</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-[oklch(0.7_0.12_70)]">{countByImpact.medium}</div>
            <div className="text-sm text-muted-foreground">Medium Impact</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-[oklch(0.65_0.15_145)]">{countByImpact.low}</div>
            <div className="text-sm text-muted-foreground">Low Impact</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search signals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as SignalType | 'all')}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(signalTypeConfig).map(([type, config]) => (
                  <SelectItem key={type} value={type}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={impactFilter} onValueChange={(v) => setImpactFilter(v as ImpactLevel | 'all')}>
              <SelectTrigger className="w-48">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact Levels</SelectItem>
                <SelectItem value="high">High Impact</SelectItem>
                <SelectItem value="medium">Medium Impact</SelectItem>
                <SelectItem value="low">Low Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Signals List */}
      <div className="space-y-4">
        {filteredSignals.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>No signals match your filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredSignals.map(signal => {
            const typeConfig = signalTypeConfig[signal.signalType];
            const TypeIcon = typeConfig.icon;
            const impact = impactConfig[signal.impactLevel];

            return (
              <Card key={signal.id} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg bg-muted ${typeConfig.color}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{signal.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {signal.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className={impact.className}>
                            {impact.label} Impact
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {signal.confidenceLevel} confidence
                          </Badge>
                        </div>
                      </div>

                      {/* Time & Source */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(signal.timeRange.start), 'MMM d, h:mm a')} - 
                          {format(new Date(signal.timeRange.end), 'MMM d, h:mm a')}
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          {signal.source.label}
                        </div>
                        {signal.areaContext && (
                          <>
                            <Separator orientation="vertical" className="h-4" />
                            <span>{signal.areaContext}</span>
                          </>
                        )}
                      </div>

                      {/* Interpretation Notes */}
                      <div className="p-3 rounded-lg bg-muted/50 mt-3">
                        <p className="text-sm text-muted-foreground">
                          <strong>Interpretation:</strong> {signal.interpretationNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Data Source Note */}
      <Separator />
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Data Sources</strong></p>
        <p>
          Signals shown here are {signals.some(s => s.source.kind === 'simulated') ? 'simulated' : ''} 
          or based on public calendars and partner-provided information. 
          No real-time data. No enforcement information.
        </p>
      </div>
    </div>
  );
}

