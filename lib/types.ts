/**
 * OUTREACH WINDOW PLANNER - Type Definitions
 *
 * ETHICAL DESIGN NOTE:
 * These types are intentionally designed to avoid:
 * - Real-time location tracking
 * - Individual identification
 * - Enforcement data correlation
 *
 * All temporal signals are aggregated, delayed, or simulated.
 * The focus is on TIME-BASED planning, not surveillance.
 */

// Signal type categories - focused on temporal disruptions
export type SignalType =
  | "sanitation" // Street cleaning, encampment sweeps (delayed/aggregated)
  | "publicEvent" // Permitted events, gatherings
  | "shelterHours" // Intake/service windows at shelters
  | "transitDisruption" // Metro closures, bus reroutes
  | "serviceBottleneck" // Known busy periods at service centers
  | "infrastructureWork" // Construction, utility work
  | "megaEvent" // Large-scale events (Olympics, World Cup)
  | "custom"; // User-added signals for planning

// Source provenance - transparency about data origins
export type SourceKind =
  | "simulated" // Generated for prototype/testing
  | "delayed" // Real but intentionally delayed (>24hr)
  | "partnerProvided" // From trusted org partners
  | "publicCalendar"; // From public event calendars

// Impact and confidence levels for explainable scoring
export type ImpactLevel = "low" | "medium" | "high";
export type ConfidenceLevel = "low" | "medium" | "high";

// Window safety classification
export type WindowStatus = "safer" | "caution" | "avoid";

/**
 * A temporal signal represents a time-bounded event that may affect
 * the safety and effectiveness of outreach activities.
 *
 * NOTE: No geographic coordinates. Location context is textual only.
 */
export interface Signal {
  id: string;
  signalType: SignalType;
  title: string;
  description: string;

  // Temporal bounds
  timeRange: {
    start: string; // ISO 8601
    end: string; // ISO 8601
  };

  // Source transparency
  source: {
    label: string;
    kind: SourceKind;
    lastUpdated?: string; // ISO 8601
  };

  // Scoring inputs
  impactLevel: ImpactLevel;
  confidenceLevel: ConfidenceLevel;

  // Human-readable context
  interpretationNotes: string;

  // Optional contextual area (text only, not coordinates)
  areaContext?: string; // e.g., "Koreatown", "Westlake/MacArthur Park"

  // Custom signals added by organizers
  isCustom?: boolean;
}

/**
 * An overlap occurs when multiple disruptive signals coincide in time.
 * These are particularly important for planning.
 */
export interface SignalOverlap {
  id: string;
  signals: Signal[];
  timeRange: {
    start: string;
    end: string;
  };
  combinedImpact: ImpactLevel;
  explanation: string; // Plain language why this overlap matters
}

/**
 * An outreach window is a time period classified by
 * its suitability for outreach activities.
 */
export interface OutreachWindow {
  id: string;
  timeRange: {
    start: string;
    end: string;
  };
  status: WindowStatus;
  score: number; // 0-100, lower is safer

  // Explainability
  annotation: string;
  contributingSignals: Signal[];
}

/**
 * API response structure for the signals endpoint
 */
export interface SignalsApiResponse {
  signals: Signal[];
  overlaps: SignalOverlap[];
  windows: OutreachWindow[];
  meta: {
    queryRange: {
      start: string;
      end: string;
    };
    scenarioMode: boolean;
    generatedAt: string;
    disclaimer: string;
  };
}

/**
 * Guidance suggestion for outreach coordinators
 */
export interface GuidanceSuggestion {
  windowId: string;
  strategies: string[];
  notes: string;
  priority: "high" | "medium" | "low";
}

/**
 * Local storage structure for custom signals
 */
export interface LocalPlannerData {
  customSignals: Signal[];
  lastModified: string;
  version: number;
}
