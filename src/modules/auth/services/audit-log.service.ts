import { prisma } from "@/lib/prisma/client";
import { AuditEventType, AuditLogMetadata } from "@/types/audit";
import { AUDIT_EVENTS } from "@/config/audit-events";
import { Prisma } from "@prisma/client";

export class AuditLogService {
  static async logEvent(
    eventType: AuditEventType,
    userId?: string,
    resourceId?: string,
    metadata?: AuditLogMetadata
  ) {
    return prisma.auditLog.create({
      data: {
        eventType,
        userId,
        resourceId,
        metadata: (metadata || {}) as Prisma.InputJsonObject,
      },
    });
  }

  static async logUserCreated(userId: string, metadata?: AuditLogMetadata) {
    return this.logEvent(AUDIT_EVENTS.USER_CREATED, userId, undefined, metadata);
  }

  static async logConsentAccepted(userId: string, consentId: string, metadata?: AuditLogMetadata) {
    return this.logEvent(AUDIT_EVENTS.CONSENT_ACCEPTED, userId, consentId, metadata);
  }

  static async logRoleChanged(userId: string, oldRole: string, newRole: string) {
    return this.logEvent(AUDIT_EVENTS.ROLE_CHANGED, userId, undefined, { oldRole, newRole });
  }
}
