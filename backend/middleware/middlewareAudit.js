// backend/middleware/middlewareAudit.js
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { auditTable } from '../src/db/schema/auditlog.js'; 
import jwt from 'jsonwebtoken'; 

const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite);

export const auditLog = async (req, res, next) => {
  // 1. SKIP ROOT PATH IMMEDIATELY
  if (req.path === '/' || req.path === '/favicon.ico') {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = function(data) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      saveAuditLog(req, res, data).catch(err => {
        console.error('❌ Audit log failed:', err);
      });
    }
    return originalJson(data);
  };

  next();
};

async function saveAuditLog(req, res, responseData) {
  try {
    const action = generateActionDescription(req);
    const auditType = determineAuditType(req.path);
    const status = determineStatus(req.method, req.path);
    const target = determineTarget(req);

    // --- USER IDENTIFICATION LOGIC ---
    let userId = 'anonymous';

    // 1. Try req.user (from verifyToken middleware)
    if (req.user?.username) {
      userId = req.user.username;
    } 
    // 2. If Login action, get from response
    else if (action === 'User Login' && responseData?.user?.username) {
      userId = responseData.user.username;
    }
    // 3. If Login action, try request body (Fallback)
    else if (action === 'User Login' && req.body?.username) {
      userId = req.body.username;
    }
    // 4. Try to decode token from header
    else if (req.headers.authorization) {
      try {
        const tokenParts = req.headers.authorization.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
            const token = tokenParts[1];
            const decoded = jwt.decode(token);
            if (decoded?.username) {
                userId = decoded.username;
            }
        }
      } catch (e) {
        console.log('⚠️ Audit Log: Failed to decode token:', e.message);
      }
    }

    // --- NOISE FILTERING ---
    // If the target is "General" AND the user is "anonymous", DO NOT LOG IT.
    // This hides the scary "anonymous viewed General" logs.
    if (userId === 'anonymous' && (target === 'General' || !target)) {
        return; 
    }

    // Optional: Also hide anonymous views of public school data if you want strictly user actions
    // if (userId === 'anonymous' && target === 'SchoolData' && req.method === 'GET') {
    //    return;
    // }

    const auditEntry = {
      audit_type: auditType,
      user_id: userId,
      action: action,
      target: target || 'General',
      status: status,
      metadata: JSON.stringify({
        method: req.method,
        path: req.path,
        query: req.query,
        // Only log body for non-GET requests to keep logs clean
        body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined
      }),
      ip_address: req.ip || req.socket?.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
      timestamp: Math.floor(Date.now() / 1000)
    };

    await db.insert(auditTable).values(auditEntry);
    console.log(`📝 Audit: [${userId}] ${action} -> ${target || 'General'}`);
  } catch (error) {
    console.error('❌ Failed to save audit log:', error);
  }
}

function generateActionDescription(req) {
  const path = req.path;
  const method = req.method;

  if (path.includes('change-password')) return 'Changed Password';
  if (path.includes('login')) return 'User Login';
  if (path.includes('logout')) return 'User Logout';
  if (path.includes('register')) return 'User Registration';

  let action = path
    .split('/')
    .filter(part => part && !part.match(/^\d+$/) && !part.match(/^[a-f0-9-]{36}$/) && part !== 'api' && part !== 'routes')
    .join(' ')
    .replace(/-/g, ' ')
    .trim();

  switch (method) {
    case 'POST': action = `Created ${action}`; break;
    case 'PUT':
    case 'PATCH': action = `Updated ${action}`; break;
    case 'DELETE': action = `Deleted ${action}`; break;
    case 'GET': action = `Viewed ${action}`; break;
    default: action = `${method} ${action}`;
  }

  return action.charAt(0).toUpperCase() + action.slice(1);
}

function determineAuditType(path) {
  if (path.includes('grade')) return 'grades';
  if (path.includes('attendance')) return 'attendance';
  if (path.includes('user') || path.includes('auth')) return 'users';
  if (path.includes('student')) return 'students';
  if (path.includes('teacher') || path.includes('guru')) return 'teachers';
  if (path.includes('school')) return 'school';
  return 'system';
}

function determineStatus(method, path) {
  if (path.includes('change-password') || path.includes('update')) return 'changed';
  if (path.includes('login')) return 'success';
  if (path.includes('logout')) return 'success';
  
  switch (method) {
    case 'POST': return 'created';
    case 'PUT':
    case 'PATCH': return 'changed';
    case 'DELETE': return 'deleted';
    case 'GET': return 'viewed';
    default: return 'completed';
  }
}

function determineTarget(req) {
  // 1. Specific ID in params
  const id = req.params.id || req.params.studentId || req.params.userId;
  // 2. Specific Name in body
  const name = req.body?.name || req.body?.username || req.body?.studentName;
  
  if (name && id) return `${name} (ID: ${id})`;
  if (name) return name;
  if (id) return `ID: ${id}`;

  // 3. Search Query
  if (req.query?.search) return `Search: "${req.query.search}"`;
  if (req.query?.q) return `Search: "${req.query.q}"`;

  // 4. Fallback: Use the URL path as the target (e.g., "School Data", "Student List")
  // This captures "position of the link or menu set"
  const pathSegments = req.path.split('/').filter(p => p && p !== 'api' && p !== 'routes' && !p.match(/^\d+$/));
  
  if (pathSegments.length > 0) {
      // Get the last meaningful segment
      const lastSegment = pathSegments[pathSegments.length - 1];
      // Format it: "school-data" -> "School Data"
      return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return null;
}

function sanitizeBody(body) {
  if (!body) return body;
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'api_key', 'newPassword', 'oldPassword'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) sanitized[field] = '[REDACTED]';
  });
  return sanitized;
}

export default auditLog;