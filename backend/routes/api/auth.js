import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken.js';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// change password route
router.post('/change-password', verifyToken, authController.changePassword);

// Get current user profile
router.get('/profileUsers', verifyToken, authController.getSelfrec);

export default router;
