import { z } from "zod";

export const PHQ9ResponseSchema = z.object({
  answer: z.number().min(0).max(3),
});

export const PHQ9CompletionSchema = z.object({
  responses: z.record(z.string(), z.number().min(0).max(3)),
});

export class PHQ9Validator {
  static validateResponse(data: unknown) {
    return PHQ9ResponseSchema.parse(data);
  }

  static validateCompletion(data: unknown) {
    const parsed = PHQ9CompletionSchema.parse(data);
    const keys = Object.keys(parsed.responses);
    if (keys.length !== 9) {
      throw new Error(`PHQ-9 requires exactly 9 responses. Received: ${keys.length}`);
    }
    return parsed;
  }
}
