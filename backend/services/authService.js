import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { eq, and } from 'drizzle-orm';
import { users } from '../src/db/schema/user.js';
import { db } from '../src/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

// ============================================================================
// SERVICE LAYER - Business Logic Only
// ============================================================================

/**
 * Read accounts from guru.json file
 * @returns {Array} List of accounts
 */
export const getAccounts = () => {
	try {
		const guruPath = path.join(__dirname, '../data/guru.json');
		const data = fs.readFileSync(guruPath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading guru.json:', error);
		return [];
	}
};

/**
 * Authenticate user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Object} User object with token, or null if authentication fails
 */
export const authenticateUser = async (username, password) => {
	try {
		const user = await db
			.select()
			.from(users)
			.where(and(eq(users.username, username), eq(users.password, password)))
			.limit(1);

		if (!user || user.length === 0) {
			return {
				success: false,
				message: 'Invalid username or password'
			};
		}

		const foundUser = user[0];

		// Create JWT token with user data
		const token = jwt.sign(
			{
				id: foundUser.id,
				username: foundUser.username,
				role: foundUser.role
			},
			JWT_SECRET,
			{ expiresIn: '24h' }
		);

		// Remove password from response
		const userResponse = {
			id: foundUser.id,
			username: foundUser.username,
			role: foundUser.role,
			email: foundUser.email // if you have email field
		};

		return {
			success: true,
			message: 'Login successful',
			token,
			user: userResponse
		};
	} catch (error) {
		console.error('Authentication error:', error);
		return { success: false, message: 'Internal server error' };
	}
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token data or null if invalid
 */
export const verifyTokenService = (token) => {
	try {
		if (!token) {
			return {
				success: false,
				message: 'No token provided'
			};
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		return {
			success: true,
			decoded
		};
	} catch (error) {
		console.error('Token verification error:', error);
		return {
			success: false,
			message: 'Invalid or expired token'
		};
	}
};
