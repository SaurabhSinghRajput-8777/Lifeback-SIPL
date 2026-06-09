import { AssessmentRepository } from "../repositories/assessment.repository";
import { AssessmentResponseRepository } from "../repositories/assessment-response.repository";
import { TemplateRepository } from "../repositories/template.repository";
import { assessmentRegistry } from "../registry";
import { AuditLogService } from "@/modules/auth/services/audit-log.service";
import { AUDIT_EVENTS } from "@/config/audit-events";
import { AssessmentTemplateConfig } from "@/types/assessment";
import { AssessmentStatus, Prisma } from "@prisma/client";

export class AssessmentService {
  static async startAssessment(templateName: string, userId?: string, anonymousSessionId?: string) {
    const template = await TemplateRepository.findByName(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    const assessment = await AssessmentRepository.create({
      templateId: template.id,
      userId,
      anonymousSessionId,
      status: AssessmentStatus.DRAFT,
      templateSnapshot: template.config || {},
    });

    await AuditLogService.logEvent(
      AUDIT_EVENTS.ASSESSMENT_CREATED,
      userId,
      assessment.id,
      { templateName, anonymousSessionId }
    );

    return assessment;
  }

  static async saveResponse(assessmentId: string, questionId: string, answer: unknown) {
    const assessment = await AssessmentRepository.findById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");

    if (assessment.status === AssessmentStatus.COMPLETED) {
      throw new Error("Cannot modify a completed assessment.");
    }

    if (assessment.status === AssessmentStatus.DRAFT) {
      await AssessmentRepository.updateStatus(assessmentId, AssessmentStatus.IN_PROGRESS);
    }

    await AssessmentResponseRepository.saveResponse(assessmentId, questionId, answer);
    return true;
  }

  static async completeAssessment(assessmentId: string) {
    const assessment = await AssessmentRepository.findById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");

    // Idempotency: Return existing report if already completed
    if (assessment.status === AssessmentStatus.COMPLETED) {
      const existingReport = await AssessmentRepository.getReport(assessmentId);
      if (existingReport) {
        return existingReport;
      }
    }

    const responsesRecords = await AssessmentResponseRepository.getResponses(assessmentId);
    const responsesMap: Record<string, unknown> = {};
    for (const r of responsesRecords) {
      responsesMap[r.questionId] = r.answer;
    }

    const templateName = assessment.template.name.toLowerCase();
    const ProviderClass = assessmentRegistry[templateName];
    if (!ProviderClass) {
      throw new Error(`Provider not found for template: ${templateName}`);
    }

    const provider = new ProviderClass();
    const config = assessment.templateSnapshot as unknown as AssessmentTemplateConfig;

    const isValid = await provider.validate(responsesMap, config);
    if (!isValid) {
      throw new Error("Assessment validation failed. All required questions must be answered.");
    }

    const result = await provider.score(responsesMap, config);

    await AssessmentRepository.updateStatus(assessmentId, AssessmentStatus.COMPLETED);

    const report = await AssessmentRepository.saveReport(assessmentId, {
      assessmentId,
      modelVersion: result.providerVersion,
      pipelineVersion: "1.0.0",
      reportSchemaVersion: "1.0.0",
      riskLevel: result.severity,
      confidenceScore: 1.0,
      reportJson: result as unknown as Prisma.InputJsonObject,
    });

    await AuditLogService.logEvent(
      AUDIT_EVENTS.ASSESSMENT_COMPLETED,
      assessment.userId || undefined,
      assessment.id,
      { templateName, score: result.totalScore, severity: result.severity }
    );

    // Cleanup any old drafts for this user and template now that a new one is completed
    await AssessmentRepository.cleanupAllDrafts(
      assessment.templateId,
      assessment.id,
      assessment.userId || undefined,
      assessment.anonymousSessionId || undefined
    );

    return report;
  }

  static async getAssessment(id: string) {
    return AssessmentRepository.findById(id);
  }

  static async getAssessmentResults(id: string) {
    return AssessmentRepository.getReport(id);
  }
}
