// backend/db/schema/audit.js (or wherever you keep your schemas)
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const auditTable = sqliteTable('audit_logs', {
  id: int().primaryKey({ autoIncrement: true }),
  audit_type: text().notNull(), // 'grades', 'attendance', 'users', 'students', 'teachers', 'system'
  user_id: text().notNull(), // username or ID of who performed the action
  action: text().notNull(), // Human-readable description: "Created grade", "Updated student"
  target: text(), // Who/what was affected: "Ahmad Rizki (ID: 123)"
  status: text().notNull(), // 'created', 'changed', 'deleted', 'viewed', 'completed'
  metadata: text(), // JSON string with additional data (request details)
  ip_address: text(), // User's IP address
  user_agent: text(), // Browser/client info
  timestamp: int().notNull().default(sql`(unixepoch())`) // Unix timestamp
// indexing db here

});