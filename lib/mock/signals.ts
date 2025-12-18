/**
 * OUTREACH WINDOW PLANNER - Mock Signal Data
 *
 * ETHICAL DESIGN NOTE:
 * All data in this file is SIMULATED or based on PUBLIC information.
 * No real-time enforcement data. No individual tracking.
 *
 * Context: Los Angeles / Koreatown
 * Purpose: Demonstrate temporal planning for harm reduction
 */

import { Signal, SignalType, ImpactLevel, ConfidenceLevel } from "../types";

// Helper to generate ISO dates relative to "now"
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

function setTime(date: Date, hours: number, minutes: number = 0): Date {
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * SIMULATED sanitation cycle signals
 * Based on typical LA street cleaning patterns (publicly available)
 * NOT real-time enforcement data
 */
const sanitationSignals: Signal[] = [
  {
    id: "sanitation-1",
    signalType: "sanitation",
    title: "Street Cleaning - Wilshire Corridor",
    description:
      "Scheduled street cleaning along Wilshire Blvd between Vermont and Western. Parking restrictions enforced.",
    timeRange: {
      start: setTime(addDays(today, 0), 8).toISOString(),
      end: setTime(addDays(today, 0), 12).toISOString(),
    },
    source: {
      label: "LA Sanitation (Simulated Pattern)",
      kind: "simulated",
      lastUpdated: now.toISOString(),
    },
    impactLevel: "medium",
    confidenceLevel: "medium",
    interpretationNotes:
      "Street cleaning often precedes increased activity. Outreach during this window may face interruptions. Consider timing outreach before or after this period.",
    areaContext: "Koreatown - Wilshire Corridor",
  },
  {
    id: "sanitation-2",
    signalType: "sanitation",
    title: "Street Cleaning - 6th Street Area",
    description:
      "Scheduled street cleaning in residential areas around 6th Street and Serrano.",
    timeRange: {
      start: setTime(addDays(today, 1), 9).toISOString(),
      end: setTime(addDays(today, 1), 13).toISOString(),
    },
    source: {
      label: "LA Sanitation (Simulated Pattern)",
      kind: "simulated",
    },
    impactLevel: "medium",
    confidenceLevel: "low",
    interpretationNotes:
      "Residential cleaning typically lower impact than commercial corridors. Monitor for changes.",
    areaContext: "Koreatown - Residential",
  },
  {
    id: "sanitation-3",
    signalType: "sanitation",
    title: "Street Cleaning - Vermont Ave",
    description:
      "Weekly street cleaning along Vermont Avenue commercial district.",
    timeRange: {
      start: setTime(addDays(today, 2), 7).toISOString(),
      end: setTime(addDays(today, 2), 11).toISOString(),
    },
    source: {
      label: "LA Sanitation (Simulated Pattern)",
      kind: "simulated",
    },
    impactLevel: "high",
    confidenceLevel: "medium",
    interpretationNotes:
      "Vermont corridor is high-traffic. Cleaning may coincide with morning service hours at nearby clinics.",
    areaContext: "Koreatown - Vermont Corridor",
  },
  {
    id: "sanitation-4",
    signalType: "sanitation",
    title: "Street Cleaning - Olympic Blvd",
    description:
      "Bi-weekly street cleaning on Olympic Blvd between Normandie and Western.",
    timeRange: {
      start: setTime(addDays(today, 3), 6).toISOString(),
      end: setTime(addDays(today, 3), 10).toISOString(),
    },
    source: {
      label: "LA Sanitation (Simulated Pattern)",
      kind: "simulated",
    },
    impactLevel: "medium",
    confidenceLevel: "high",
    interpretationNotes:
      "Early morning cleaning. People may need to relocate temporarily. Good opportunity for outreach afterward.",
    areaContext: "Koreatown - Olympic Corridor",
  },
];

/**
 * SIMULATED public event signals
 * Based on typical community event patterns
 */
const publicEventSignals: Signal[] = [
  {
    id: "event-1",
    signalType: "publicEvent",
    title: "K-Town Night Market",
    description:
      "Monthly night market event at Robert F. Kennedy Community Schools. High foot traffic expected.",
    timeRange: {
      start: setTime(addDays(today, 2), 17).toISOString(),
      end: setTime(addDays(today, 2), 22).toISOString(),
    },
    source: {
      label: "Community Calendar (Public)",
      kind: "publicCalendar",
    },
    impactLevel: "medium",
    confidenceLevel: "high",
    interpretationNotes:
      "Community events can be opportunities for resource distribution but may also increase displacement pressure. Coordinate with event organizers if possible.",
    areaContext: "Koreatown",
  },
  {
    id: "event-2",
    signalType: "publicEvent",
    title: "Wilshire Center Farmers Market",
    description: "Weekly farmers market. Blocks portion of street parking.",
    timeRange: {
      start: setTime(addDays(today, 3), 9).toISOString(),
      end: setTime(addDays(today, 3), 14).toISOString(),
    },
    source: {
      label: "Community Calendar (Public)",
      kind: "publicCalendar",
    },
    impactLevel: "low",
    confidenceLevel: "high",
    interpretationNotes:
      "Farmers markets typically low disruption. Some food resources may be available for distribution.",
    areaContext: "Wilshire Center",
  },
  {
    id: "event-3",
    signalType: "publicEvent",
    title: "Community Health Fair",
    description:
      "Free health screenings and resources at MacArthur Park. Partner organizations will be present.",
    timeRange: {
      start: setTime(addDays(today, 4), 10).toISOString(),
      end: setTime(addDays(today, 4), 16).toISOString(),
    },
    source: {
      label: "Community Calendar (Public)",
      kind: "publicCalendar",
    },
    impactLevel: "low",
    confidenceLevel: "high",
    interpretationNotes:
      "Excellent opportunity for connecting community members with health resources. Coordinate to avoid duplication.",
    areaContext: "MacArthur Park",
  },
  {
    id: "event-4",
    signalType: "publicEvent",
    title: "LACMA Free Admission Day",
    description:
      "Free museum admission draws large crowds to Wilshire/Fairfax area.",
    timeRange: {
      start: setTime(addDays(today, 5), 11).toISOString(),
      end: setTime(addDays(today, 5), 20).toISOString(),
    },
    source: {
      label: "Community Calendar (Public)",
      kind: "publicCalendar",
    },
    impactLevel: "low",
    confidenceLevel: "high",
    interpretationNotes:
      "Increased pedestrian activity in museum area. Generally positive atmosphere.",
    areaContext: "Miracle Mile",
  },
];

/**
 * SIMULATED shelter and service hour signals
 * Based on typical shelter operating patterns
 */
const shelterSignals: Signal[] = [
  {
    id: "shelter-1",
    signalType: "shelterHours",
    title: "Emergency Shelter Intake Opens",
    description:
      "Nightly intake window at area emergency shelters. High demand period.",
    timeRange: {
      start: setTime(today, 17).toISOString(),
      end: setTime(today, 20).toISOString(),
    },
    source: {
      label: "LAHSA Shelter Network (Simulated)",
      kind: "simulated",
    },
    impactLevel: "low",
    confidenceLevel: "high",
    interpretationNotes:
      "Shelter intake is a positive resource window. Outreach can help connect people to beds during this time.",
    areaContext: "Los Angeles - Citywide",
  },
  {
    id: "shelter-2",
    signalType: "shelterHours",
    title: "Day Center Services - Union Rescue Mission",
    description:
      "Day center services including showers, meals, and case management.",
    timeRange: {
      start: setTime(addDays(today, 0), 8).toISOString(),
      end: setTime(addDays(today, 0), 14).toISOString(),
    },
    source: {
      label: "Partner Services (Simulated)",
      kind: "partnerProvided",
    },
    impactLevel: "low",
    confidenceLevel: "high",
    interpretationNotes:
      "Day centers provide essential services. Consider coordinating outreach to complement rather than compete with these hours.",
    areaContext: "Koreatown Area",
  },
  {
    id: "shelter-3",
    signalType: "shelterHours",
    title: "Mobile Shower Unit - Vermont/Wilshire",
    description:
      "Weekly mobile shower and hygiene services near Metro station.",
    timeRange: {
      start: setTime(addDays(today, 1), 10).toISOString(),
      end: setTime(addDays(today, 1), 15).toISOString(),
    },
    source: {
      label: "Partner Services (Simulated)",
      kind: "partnerProvided",
    },
    impactLevel: "low",
    confidenceLevel: "high",
    interpretationNotes:
      "Great opportunity for outreach coordination. People gathering for services are more accessible.",
    areaContext: "Koreatown - Vermont/Wilshire",
  },
  {
    id: "shelter-4",
    signalType: "shelterHours",
    title: "Hot Meal Service - St. Basil's",
    description: "Daily hot meal service at church community center.",
    timeRange: {
      start: setTime(addDays(today, 0), 11).toISOString(),
      end: setTime(addDays(today, 0), 13).toISOString(),
    },
    source: {
      label: "Partner Services (Simulated)",
      kind: "partnerProvided",
    },
    impactLevel: "low",
    confidenceLevel: "high",
    interpretationNotes:
      "Meal times are predictable gathering points. Excellent for resource distribution and relationship building.",
    areaContext: "Koreatown - Wilshire",
  },
];

/**
 * SIMULATED transit disruption signals
 */
const transitSignals: Signal[] = [
  {
    id: "transit-1",
    signalType: "transitDisruption",
    title: "Metro Purple Line Construction",
    description:
      "Ongoing construction at Wilshire/Western station. Reduced service and street closures.",
    timeRange: {
      start: setTime(today, 0).toISOString(),
      end: setTime(addDays(today, 7), 23, 59).toISOString(),
    },
    source: {
      label: "LA Metro (Public)",
      kind: "publicCalendar",
    },
    impactLevel: "medium",
    confidenceLevel: "high",
    interpretationNotes:
      "Construction zones can complicate access for both outreach teams and community members. Plan alternative routes.",
    areaContext: "Koreatown - Wilshire/Western",
  },
  {
    id: "transit-2",
    signalType: "transitDisruption",
    title: "Bus Reroute - Vermont Line",
    description: "Temporary bus reroute due to utility work. Stops relocated.",
    timeRange: {
      start: setTime(addDays(today, 2), 6).toISOString(),
      end: setTime(addDays(today, 2), 18).toISOString(),
    },
    source: {
      label: "LA Metro (Simulated)",
      kind: "simulated",
    },
    impactLevel: "low",
    confidenceLevel: "medium",
    interpretationNotes:
      "Minor disruption. Some community members may be displaced from usual transit stops.",
    areaContext: "Vermont Corridor",
  },
];

/**
 * SIMULATED service bottleneck signals
 */
const serviceBottleneckSignals: Signal[] = [
  {
    id: "bottleneck-1",
    signalType: "serviceBottleneck",
    title: "Benefits Office High Volume",
    description:
      "First week of month typically sees high volume at DPSS offices.",
    timeRange: {
      start: setTime(addDays(today, 0), 8).toISOString(),
      end: setTime(addDays(today, 3), 17).toISOString(),
    },
    source: {
      label: "Service Provider Network (Simulated)",
      kind: "simulated",
    },
    impactLevel: "medium",
    confidenceLevel: "medium",
    interpretationNotes:
      "High volume periods at benefits offices mean longer waits. Outreach can help with paperwork prep beforehand.",
    areaContext: "Los Angeles - Multiple Locations",
  },
];

/**
 * SIMULATED infrastructure signals
 */
const infrastructureSignals: Signal[] = [
  {
    id: "infra-1",
    signalType: "infrastructureWork",
    title: "Water Main Repair",
    description:
      "Emergency water main repair. Street closure and reduced pedestrian access.",
    timeRange: {
      start: setTime(addDays(today, 1), 7).toISOString(),
      end: setTime(addDays(today, 1), 19).toISOString(),
    },
    source: {
      label: "LADWP (Simulated)",
      kind: "simulated",
    },
    impactLevel: "medium",
    confidenceLevel: "low",
    interpretationNotes:
      "Infrastructure work can cause temporary displacement and access issues. Confirm completion before planning outreach in area.",
    areaContext: "Koreatown - 8th Street",
  },
];

/**
 * SCENARIO MODE: Mega-event signals (2028 Olympics simulation)
 * These are clearly speculative and labeled as such
 */
export const megaEventSignals: Signal[] = [
  {
    id: "mega-1",
    signalType: "megaEvent",
    title: "[SCENARIO] Olympics Opening Week",
    description:
      "SPECULATIVE: Simulated increased activity during Olympics opening ceremonies. Expect heightened security presence and potential displacement pressure.",
    timeRange: {
      start: setTime(addDays(today, 14), 0).toISOString(),
      end: setTime(addDays(today, 21), 23, 59).toISOString(),
    },
    source: {
      label: "Scenario Simulation (Speculative)",
      kind: "simulated",
    },
    impactLevel: "high",
    confidenceLevel: "low",
    interpretationNotes:
      "SCENARIO MODE: This signal represents potential conditions during a mega-event. Actual impacts will vary. Use for planning exercises only.",
    areaContext: "Los Angeles - Citywide",
  },
  {
    id: "mega-2",
    signalType: "megaEvent",
    title: "[SCENARIO] Transit Surge Period",
    description:
      "SPECULATIVE: Simulated transit system at capacity. Metro stations may have restricted access.",
    timeRange: {
      start: setTime(addDays(today, 15), 6).toISOString(),
      end: setTime(addDays(today, 15), 22).toISOString(),
    },
    source: {
      label: "Scenario Simulation (Speculative)",
      kind: "simulated",
    },
    impactLevel: "high",
    confidenceLevel: "low",
    interpretationNotes:
      "SCENARIO MODE: Transit hubs near K-Town (Wilshire/Vermont, Wilshire/Western) may see increased security. Plan alternative meeting points.",
    areaContext: "Koreatown - Transit Hubs",
  },
  {
    id: "mega-3",
    signalType: "megaEvent",
    title: "[SCENARIO] Venue Buffer Zones",
    description:
      "SPECULATIVE: Security perimeters around event venues may expand, affecting nearby areas.",
    timeRange: {
      start: setTime(addDays(today, 14), 0).toISOString(),
      end: setTime(addDays(today, 28), 23, 59).toISOString(),
    },
    source: {
      label: "Scenario Simulation (Speculative)",
      kind: "simulated",
    },
    impactLevel: "high",
    confidenceLevel: "low",
    interpretationNotes:
      "SCENARIO MODE: Buffer zones around venues historically cause displacement. This is speculative planning for potential 2028 conditions.",
    areaContext: "Los Angeles - Venue Adjacent",
  },
];

/**
 * Get all base signals (without scenario mode)
 */
export function getBaseSignals(): Signal[] {
  return [
    ...sanitationSignals,
    ...publicEventSignals,
    ...shelterSignals,
    ...transitSignals,
    ...serviceBottleneckSignals,
    ...infrastructureSignals,
  ];
}

/**
 * Get signals with optional scenario mode
 */
export function getAllSignals(includeScenario: boolean = false): Signal[] {
  const base = getBaseSignals();
  if (includeScenario) {
    return [...base, ...megaEventSignals];
  }
  return base;
}

/**
 * Filter signals by date range
 */
export function filterSignalsByDateRange(
  signals: Signal[],
  start: Date,
  end: Date
): Signal[] {
  return signals.filter((signal) => {
    const signalStart = new Date(signal.timeRange.start);
    const signalEnd = new Date(signal.timeRange.end);

    // Check for any overlap with the query range
    return signalStart <= end && signalEnd >= start;
  });
}

/**
 * Group signals by type
 */
export function groupSignalsByType(
  signals: Signal[]
): Record<SignalType, Signal[]> {
  const grouped: Record<SignalType, Signal[]> = {
    sanitation: [],
    publicEvent: [],
    shelterHours: [],
    transitDisruption: [],
    serviceBottleneck: [],
    infrastructureWork: [],
    megaEvent: [],
    custom: [],
  };

  for (const signal of signals) {
    grouped[signal.signalType].push(signal);
  }

  return grouped;
}

/**
 * Get signals by impact level
 */
export function getHighImpactSignals(signals: Signal[]): Signal[] {
  return signals.filter((s) => s.impactLevel === "high");
}
