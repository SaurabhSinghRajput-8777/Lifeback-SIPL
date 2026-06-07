export interface AssessmentOption {
  value: string | number;
  label: string;
  weight?: number;
}

export interface AssessmentQuestion {
  id: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TEXT" | "SCALE" | "VOICE";
  text: string;
  options?: AssessmentOption[];
  required?: boolean;
}

export interface AssessmentTemplateConfig {
  questions: AssessmentQuestion[];
  metadata?: Record<string, unknown>;
}

export interface AssessmentResult {
  providerVersion: string;
  totalScore: number;
  severity: string;
  summary: string;
  metadata?: Record<string, unknown>;
}
