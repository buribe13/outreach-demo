/**
 * OUTREACH WINDOW PLANNER - Window Scoring & Computation
 * 
 * ETHICAL DESIGN NOTE:
 * This scoring system is TRANSPARENT and EXPLAINABLE.
 * It does NOT predict enforcement actions.
 * It helps organizers identify times with FEWER disruptions.
 * 
 * The goal is harm REDUCTION through timing, not surveillance.
 */

import {
  Signal,
  SignalOverlap,
  OutreachWindow,
  ImpactLevel,
  ConfidenceLevel,
  WindowStatus,
} from './types';

// Scoring weights - intentionally simple and explainable
const IMPACT_WEIGHTS: Record<ImpactLevel, number> = {
  low: 10,
  medium: 30,
  high: 50,
};

// Confidence affects how much we trust the impact score
const CONFIDENCE_MULTIPLIERS: Record<ConfidenceLevel, number> = {
  low: 0.5,    // Low confidence = reduce weight
  medium: 0.75,
  high: 1.0,
};

// Window status thresholds
const STATUS_THRESHOLDS = {
  safer: 20,   // Score 0-20 = safer window
  caution: 50, // Score 21-50 = proceed with caution
  // Score > 50 = avoid if possible
};

/**
 * Default window duration in milliseconds (2 hours)
 * Adjustable based on organizational needs
 */
const DEFAULT_WINDOW_DURATION_MS = 2 * 60 * 60 * 1000;

/**
 * Compute the disruption score for a single signal
 */
function computeSignalScore(signal: Signal): number {
  const baseScore = IMPACT_WEIGHTS[signal.impactLevel];
  const multiplier = CONFIDENCE_MULTIPLIERS[signal.confidenceLevel];
  return baseScore * multiplier;
}

/**
 * Find overlapping signals within a time range
 */
export function findOverlaps(
  signals: Signal[],
  windowStart: Date,
  windowEnd: Date
): Signal[] {
  return signals.filter(signal => {
    const signalStart = new Date(signal.timeRange.start);
    const signalEnd = new Date(signal.timeRange.end);
    
    // Check if signal overlaps with window
    return signalStart < windowEnd && signalEnd > windowStart;
  });
}

/**
 * Generate an explanation for why a window has its status
 */
function generateAnnotation(
  overlappingSignals: Signal[],
  status: WindowStatus
): string {
  if (overlappingSignals.length === 0) {
    return 'No known disruptions during this window. Good opportunity for outreach.';
  }
  
  const highImpact = overlappingSignals.filter(s => s.impactLevel === 'high');
  const mediumImpact = overlappingSignals.filter(s => s.impactLevel === 'medium');
  
  const parts: string[] = [];
  
  if (highImpact.length > 0) {
    parts.push(`${highImpact.length} high-impact signal(s): ${highImpact.map(s => s.title).join(', ')}`);
  }
  
  if (mediumImpact.length > 0) {
    parts.push(`${mediumImpact.length} medium-impact signal(s)`);
  }
  
  const lowImpactCount = overlappingSignals.length - highImpact.length - mediumImpact.length;
  if (lowImpactCount > 0) {
    parts.push(`${lowImpactCount} low-impact signal(s)`);
  }
  
  switch (status) {
    case 'safer':
      return `Minor activity: ${parts.join('; ')}. Generally safe for outreach with awareness.`;
    case 'caution':
      return `Moderate disruption: ${parts.join('; ')}. Proceed with flexibility and backup plans.`;
    case 'avoid':
      return `High disruption: ${parts.join('; ')}. Consider rescheduling if possible.`;
  }
}

/**
 * Determine window status from score
 */
function getStatusFromScore(score: number): WindowStatus {
  if (score <= STATUS_THRESHOLDS.safer) return 'safer';
  if (score <= STATUS_THRESHOLDS.caution) return 'caution';
  return 'avoid';
}

/**
 * Compute outreach windows for a date range
 * 
 * This slices the range into fixed intervals and scores each one
 * based on overlapping signals.
 */
export function computeWindows(
  signals: Signal[],
  rangeStart: Date,
  rangeEnd: Date,
  windowDurationMs: number = DEFAULT_WINDOW_DURATION_MS
): OutreachWindow[] {
  const windows: OutreachWindow[] = [];
  
  let currentStart = new Date(rangeStart);
  let windowIndex = 0;
  
  while (currentStart < rangeEnd) {
    const currentEnd = new Date(
      Math.min(currentStart.getTime() + windowDurationMs, rangeEnd.getTime())
    );
    
    // Find signals that overlap with this window
    const overlapping = findOverlaps(signals, currentStart, currentEnd);
    
    // Compute score: sum of all overlapping signal scores
    // Capped at 100 for readability
    const rawScore = overlapping.reduce((sum, signal) => {
      return sum + computeSignalScore(signal);
    }, 0);
    const score = Math.min(100, rawScore);
    
    const status = getStatusFromScore(score);
    
    windows.push({
      id: `window-${windowIndex}`,
      timeRange: {
        start: currentStart.toISOString(),
        end: currentEnd.toISOString(),
      },
      status,
      score,
      annotation: generateAnnotation(overlapping, status),
      contributingSignals: overlapping,
    });
    
    currentStart = currentEnd;
    windowIndex++;
  }
  
  return windows;
}

/**
 * Detect signal overlaps - periods where multiple disruptive signals coincide
 * These are particularly important for planning.
 */
export function detectSignalOverlaps(signals: Signal[]): SignalOverlap[] {
  const overlaps: SignalOverlap[] = [];
  
  // Only consider medium and high impact signals for overlap detection
  const significantSignals = signals.filter(
    s => s.impactLevel === 'medium' || s.impactLevel === 'high'
  );
  
  // Check each pair of signals for overlap
  for (let i = 0; i < significantSignals.length; i++) {
    for (let j = i + 1; j < significantSignals.length; j++) {
      const signalA = significantSignals[i];
      const signalB = significantSignals[j];
      
      const startA = new Date(signalA.timeRange.start);
      const endA = new Date(signalA.timeRange.end);
      const startB = new Date(signalB.timeRange.start);
      const endB = new Date(signalB.timeRange.end);
      
      // Check for overlap
      if (startA < endB && endA > startB) {
        // Calculate overlap period
        const overlapStart = new Date(Math.max(startA.getTime(), startB.getTime()));
        const overlapEnd = new Date(Math.min(endA.getTime(), endB.getTime()));
        
        // Determine combined impact
        const combinedImpact: ImpactLevel = 
          signalA.impactLevel === 'high' || signalB.impactLevel === 'high'
            ? 'high'
            : 'medium';
        
        overlaps.push({
          id: `overlap-${signalA.id}-${signalB.id}`,
          signals: [signalA, signalB],
          timeRange: {
            start: overlapStart.toISOString(),
            end: overlapEnd.toISOString(),
          },
          combinedImpact,
          explanation: generateOverlapExplanation(signalA, signalB),
        });
      }
    }
  }
  
  return overlaps;
}

/**
 * Generate plain-language explanation of why an overlap matters
 */
function generateOverlapExplanation(signalA: Signal, signalB: Signal): string {
  const typeDescriptions: Record<string, string> = {
    sanitation: 'sanitation activity',
    publicEvent: 'public event',
    shelterHours: 'shelter service hours',
    transitDisruption: 'transit disruption',
    serviceBottleneck: 'service bottleneck',
    infrastructureWork: 'infrastructure work',
    megaEvent: 'major event',
    custom: 'planned activity',
  };
  
  const descA = typeDescriptions[signalA.signalType] || signalA.signalType;
  const descB = typeDescriptions[signalB.signalType] || signalB.signalType;
  
  return `${signalA.title} (${descA}) overlaps with ${signalB.title} (${descB}). ` +
    `Multiple disruptions increase unpredictability. Consider alternative windows or enhanced coordination.`;
}

/**
 * Get summary statistics for a set of windows
 */
export function getWindowSummary(windows: OutreachWindow[]): {
  total: number;
  safer: number;
  caution: number;
  avoid: number;
  averageScore: number;
} {
  const safer = windows.filter(w => w.status === 'safer').length;
  const caution = windows.filter(w => w.status === 'caution').length;
  const avoid = windows.filter(w => w.status === 'avoid').length;
  const averageScore = windows.length > 0
    ? windows.reduce((sum, w) => sum + w.score, 0) / windows.length
    : 0;
  
  return {
    total: windows.length,
    safer,
    caution,
    avoid,
    averageScore: Math.round(averageScore),
  };
}

/**
 * Find the next safer window from a given time
 */
export function findNextSaferWindow(
  windows: OutreachWindow[],
  fromTime: Date = new Date()
): OutreachWindow | null {
  const futureWindows = windows.filter(
    w => new Date(w.timeRange.start) >= fromTime && w.status === 'safer'
  );
  
  if (futureWindows.length === 0) return null;
  
  return futureWindows.sort((a, b) => 
    new Date(a.timeRange.start).getTime() - new Date(b.timeRange.start).getTime()
  )[0];
}

