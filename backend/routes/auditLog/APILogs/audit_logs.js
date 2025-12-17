// backend/routes/auditLog/APILogs/audit_logs.js
import express from 'express';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { auditTable } from '../../../src/db/schema/auditlog.js'; // adjust path as needed
import { desc, eq, like, and, or, gte, lte } from 'drizzle-orm';

const router = express.Router();

const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite);

/**
 * GET /api/audit-logs
 * Fetch audit logs with optional filters
 * Query params:
 * - type: filter by audit_type
 * - user: filter by user_id
 * - status: filter by status
 * - search: search in action, target, user_id
 * - timeRange: today, week, month, semester
 */
router.get('/', async (req, res) => {
  try {
    const { type, user, status, search, timeRange } = req.query;

    // Build query conditions
    let conditions = [];

    if (type && type !== 'all') {
      conditions.push(eq(auditTable.audit_type, type));
    }

    if (user) {
      conditions.push(like(auditTable.user_id, `%${user}%`));
    }

    if (status && status !== 'all') {
      conditions.push(eq(auditTable.status, status));
    }

    if (search) {
      conditions.push(
        or(
          like(auditTable.action, `%${search}%`),
          like(auditTable.target, `%${search}%`),
          like(auditTable.user_id, `%${search}%`)
        )
      );
    }

    // Time range filter
    if (timeRange && timeRange !== 'all') {
      const now = Math.floor(Date.now() / 1000);
      let startTime;

      switch (timeRange) {
        case 'today':
          startTime = now - (24 * 60 * 60); // 24 hours
          break;
        case 'week':
          startTime = now - (7 * 24 * 60 * 60); // 7 days
          break;
        case 'month':
          startTime = now - (30 * 24 * 60 * 60); // 30 days
          break;
        case 'semester':
          startTime = now - (180 * 24 * 60 * 60); // ~6 months
          break;
      }

      if (startTime) {
        conditions.push(gte(auditTable.timestamp, startTime));
      }
    }

    // Execute query
    let query = db.select().from(auditTable);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const logs = await query.orderBy(desc(auditTable.timestamp));

    // Convert timestamp to ISO string for frontend
    const formattedLogs = logs.map(log => ({
      ...log,
      timestamp: new Date(log.timestamp * 1000).toISOString()
    }));

    res.json(formattedLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
});

/**
 * GET /api/audit-logs/:id
 * Get single audit log by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const log = await db
      .select()
      .from(auditTable)
      .where(eq(auditTable.id, parseInt(id)))
      .limit(1);

    if (log.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found'
      });
    }

    // Convert timestamp to ISO string
    const formattedLog = {
      ...log[0],
      timestamp: new Date(log[0].timestamp * 1000).toISOString()
    };

    res.json(formattedLog);
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit log',
      error: error.message
    });
  }
});

export default router;