export interface SearchFilters {
  minGrantAmount: number | '';
  eligibility: string[];
  customEligibility: string;
  subsidyTypes: string[];
}

export interface AdvisorInput {
  country: string;
  clientProfile: string;
  filters: SearchFilters;
}

export interface Subsidy {
  name: string;
  description: string;
  eligibility: string[];
  potentialBenefit: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface GeminiResponse {
  subsidies: Subsidy[];
  summary: string;
}
