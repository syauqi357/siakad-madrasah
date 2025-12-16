import express from 'express';
import * as authController from '../../controllers/authController.js';
import { verifyToken } from '../../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// change password route
router.post('/change-password', verifyToken, authController.changePassword);

export default router;
