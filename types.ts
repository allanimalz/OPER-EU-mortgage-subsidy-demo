/**
 * Defines the structure for the advanced search filters.
 */
export interface SearchFilters {
  /** The minimum grant amount in euros. Can be a number or an empty string if not set. */
  minGrantAmount: number | '';
  /** A list of predefined eligibility criteria checkboxes. */
  eligibility: string[];
  /** A field for any other user-defined eligibility criteria. */
  customEligibility: string;
  /** A list of subsidy types to filter by (e.g., 'Grant', 'Loan'). */
  subsidyTypes: string[];
}

/**
 * Represents the complete input from the advisor's form, which is sent to the Gemini API service.
 */
export interface AdvisorInput {
  /** The selected EU country for the search. */
  country: string;
  /** The textual description of the client's profile and needs. */
  clientProfile: string;
  /** The advanced search filters. */
  filters: SearchFilters;
}

/**
 * Defines the structure for a single subsidy found by the API.
 */
export interface Subsidy {
  /** The official name of the subsidy. */
  name: string;
  /** A brief description of what the subsidy offers. */
  description: string;
  /** A list of key eligibility requirements. */
  eligibility: string[];
  /** A description of the financial or other benefits provided by the subsidy. */
  potentialBenefit: string;
}

/**
 * Defines the structure for a single grounding source (a web page) returned by the Gemini API.
 */
export interface GroundingChunk {
  web: {
    /** The URL of the source web page. */
    uri: string;
    /** The title of the source web page. */
    title: string;
  };
}

/**
 * Represents the top-level structure of the JSON response expected from the Gemini API.
 */
export interface GeminiResponse {
  /** An array of discovered subsidies. */
  subsidies: Subsidy[];
  /** A high-level summary of the findings, suitable for display to the user. */
  summary: string;
}