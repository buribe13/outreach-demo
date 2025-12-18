/**
 * OUTREACH WINDOW PLANNER - Signals API Route
 * 
 * ETHICAL DESIGN NOTE:
 * This API ONLY serves:
 * - Simulated data for prototype purposes
 * - Delayed/aggregated data (never real-time)
 * - Public calendar information
 * 
 * It does NOT provide:
 * - Real-time enforcement data
 * - Individual location data
 * - Predictive enforcement models
 * 
 * All responses include a disclaimer about data provenance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllSignals, filterSignalsByDateRange } from '@/lib/mock/signals';
import { computeWindows, detectSignalOverlaps } from '@/lib/windowing';
import type { SignalsApiResponse } from '@/lib/types';

/**
 * GET /api/signals
 * 
 * Query parameters:
 * - start: ISO date string (default: now)
 * - end: ISO date string (default: 7 days from start)
 * - scenario: 'on' | 'off' (default: off)
 * 
 * Returns signals, overlaps, and computed windows for the requested range.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse date range from query params
  const now = new Date();
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const scenarioParam = searchParams.get('scenario');
  
  const start = startParam ? new Date(startParam) : now;
  const end = endParam 
    ? new Date(endParam) 
    : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const includeScenario = scenarioParam === 'on';
  
  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json(
      { error: 'Invalid date format. Use ISO 8601 format.' },
      { status: 400 }
    );
  }
  
  if (end <= start) {
    return NextResponse.json(
      { error: 'End date must be after start date.' },
      { status: 400 }
    );
  }
  
  // Get signals (simulated/delayed only)
  const allSignals = getAllSignals(includeScenario);
  const filteredSignals = filterSignalsByDateRange(allSignals, start, end);
  
  // Compute windows and overlaps
  const windows = computeWindows(filteredSignals, start, end);
  const overlaps = detectSignalOverlaps(filteredSignals);
  
  // Build response with mandatory disclaimer
  const response: SignalsApiResponse = {
    signals: filteredSignals,
    overlaps,
    windows,
    meta: {
      queryRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      scenarioMode: includeScenario,
      generatedAt: new Date().toISOString(),
      disclaimer: 'PROTOTYPE DATA: All signals are simulated or based on delayed/public information. ' +
        'This tool does not provide real-time data, enforcement information, or individual tracking. ' +
        'Use for organizational planning purposes only. Verify conditions before outreach activities.',
    },
  };
  
  return NextResponse.json(response);
}

