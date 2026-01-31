import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const auditTable = sqliteTable('audit_logs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	audit_type: text('audit_type').notNull(),
	user_id: text('user_id').notNull(),
	action: text('action').notNull(),
	target: text('target'),
	status: text('status').notNull(),
	metadata: text('metadata'),
	ip_address: text('ip_address'),
	user_agent: text('user_agent'),
	timestamp: integer('timestamp').default(sql`(unixepoch())`).notNull()
});
