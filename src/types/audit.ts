import { AUDIT_EVENTS } from "../config/audit-events";

export type AuditEventType = keyof typeof AUDIT_EVENTS;

export interface AuditLogMetadata {
  [key: string]: unknown;
}
