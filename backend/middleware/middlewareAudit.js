// backend/middleware/middlewareAudit.js
import { drizzle } from 'drizzle-orm/better-sqlite3';
// importing database
import Database from 'better-sqlite3';
// importing from : backend\src\db\schema\auditlog.js
import { auditTable } from '../src/db/schema/auditlog.js'; 

// env database positions
const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite);

/**
 * Audit log middleware
 * Automatically logs API actions to database
 */

// auditlog export usage : 
export const auditLog = async (req, res, next) => {
  // Store original json method
  const originalJson = res.json.bind(res);

  // Override res.json to capture successful responses
  res.json = function(data) {
    // Only log if response is successful (2xx status)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Don't wait for logging to complete
      saveAuditLog(req, res).catch(err => {
        console.error('❌ Audit log failed:', err);
      });
    }
    
    return originalJson(data);
  };

  next();
};

/**
 * Save audit log to database
 */
async function saveAuditLog(req, res) {
  try {
    // Generate action description from route
    const action = generateActionDescription(req);
    
    // Determine audit type from route path
    const auditType = determineAuditType(req.path);
    
    // Determine status from HTTP method
    const status = determineStatus(req.method, req.path);
    
    // Get target if available (from params or body)
    const target = determineTarget(req);

    const auditEntry = {
      audit_type: auditType,
      user_id: req.user?.username || req.user?.id || 'anonymous',
      action: action,
      target: target,
      status: status,
      metadata: JSON.stringify({
        method: req.method,
        path: req.path,
        body: sanitizeBody(req.body),
        query: req.query,
        params: req.params
      }),
      ip_address: req.ip || req.socket?.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
      timestamp: Math.floor(Date.now() / 1000)
    };

    await db.insert(auditTable).values(auditEntry);
    console.log('📝 Audit logged:', action);
  } catch (error) {
    console.error('❌ Failed to save audit log:', error);
    // Don't throw error - we don't want to break the actual request
  }
}

/**
 * Generate human-readable action description from route
 */
function generateActionDescription(req) {
  const path = req.path;
  const method = req.method;

  // Convert path to readable format
  // Examples: 
  // /change-password -> "Changed password"
  // /users/123 -> "Modified user"
  // /grades -> "Created grade"
  
  let action = path
    .split('/')
    .filter(part => part && !part.match(/^\d+$/) && !part.match(/^[a-f0-9-]{36}$/)) // remove IDs
    .join(' ')
    .replace(/-/g, ' ')
    .trim();

  // Add verb based on HTTP method
  switch (method) {
    case 'POST':
      action = `Created ${action}` || 'Created resource';
      break;
    case 'PUT':
    case 'PATCH':
      action = `Updated ${action}` || 'Updated resource';
      break;
    case 'DELETE':
      action = `Deleted ${action}` || 'Deleted resource';
      break;
    case 'GET':
      action = `Viewed ${action}` || 'Viewed resource';
      break;
    default:
      action = `${method} ${action}`;
  }

  // Capitalize first letter
  return action.charAt(0).toUpperCase() + action.slice(1);
}

/**
 * Determine audit type from route path
 */
function determineAuditType(path) {
  if (path.includes('grade')) return 'grades';
  if (path.includes('attendance')) return 'attendance';
  if (path.includes('user') || path.includes('auth')) return 'users';
  if (path.includes('student')) return 'students';
  if (path.includes('teacher') || path.includes('guru')) return 'teachers';
  
  return 'system';
}

/**
 * Determine status from HTTP method and route
 */
function determineStatus(method, path) {
  // Special cases based on route
  if (path.includes('change-password') || path.includes('update')) return 'changed';
  if (path.includes('login')) return 'success';
  if (path.includes('logout')) return 'success';
  
  // Default based on HTTP method
  switch (method) {
    case 'POST': return 'created';
    case 'PUT':
    case 'PATCH': return 'changed';
    case 'DELETE': return 'deleted';
    case 'GET': return 'viewed';
    default: return 'completed';
  }
}

/**
 * Determine target from request
 */
function determineTarget(req) {
  // Try to get meaningful target from params or body
  const id = req.params.id || req.params.studentId || req.params.userId;
  const name = req.body?.name || req.body?.username || req.body?.studentName;
  
  if (name && id) return `${name} (ID: ${id})`;
  if (name) return name;
  if (id) return `ID: ${id}`;
  
  return null;
}

/**
 * Remove sensitive data from body before logging
 */
function sanitizeBody(body) {
  if (!body) return body;
  
  const sanitized = { ...body };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'api_key'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

export default auditLog;