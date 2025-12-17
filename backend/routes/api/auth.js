import express from 'express';
import { verifyToken } from '../../middleware/verifyToken.js';
import { auditLog } from '../../middleware/middlewareAudit.js';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', auditLog, authController.login);

// Logout route
router.post('/logout', auditLog, authController.logout);

// change password route
router.post('/change-password', verifyToken, auditLog, authController.changePassword);

export default router;
