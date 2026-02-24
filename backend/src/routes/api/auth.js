import express from 'express';
import { VERIFY_TOKEN_MIDDLEWARE } from '../../middlewares/verifyToken.js';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// change password route
router.post('/change-password', VERIFY_TOKEN_MIDDLEWARE, authController.changePassword);

// Get current user profile
router.get('/profileUsers', VERIFY_TOKEN_MIDDLEWARE, authController.getSelfrec);

export default router;
