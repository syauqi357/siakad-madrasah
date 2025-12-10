import express from 'express';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

export default router;
