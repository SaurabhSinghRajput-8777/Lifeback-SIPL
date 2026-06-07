export interface AssessmentProvider {
  validate(): Promise<boolean>;
  submit(data: Record<string, unknown>): Promise<Record<string, unknown>>;
  score(responses: Record<string, unknown>): Promise<number | Record<string, unknown>>;
  generateReport(resultId: string): Promise<Record<string, unknown>>;
}
