// import fs from 'fs';
// import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // bcryptjs for password hashing (pure JS, no native compilation)
import { eq } from 'drizzle-orm'; // drizzle-orm for database queries
import { users } from '../src/db/schema/user.js'; //schema user
import { db } from '../src/index.js'; // database connection
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * SERVICE LAYER - Business Logic Only
 *
 * Read accounts from guru.json file
 * @returns {Array} List of accounts
 * disabled code
 *
 * Authenticate user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Object} User object with token, or null if authentication fails
 *
 * */


export const AUTHENTICATE_USERS = async (username, password) => {
	try {
		// 1. Find user by username only
		const user = await db
			.select()
			.from(users)
			.where(eq(users.username, username)) // Only check username
			.limit(1);

		if (!user || user.length === 0) {
			return {
				success: false,
				message: 'Invalid username or password'
			};
		}

		const foundUser = user[0];

		// 2. Compare password with bcrypt
		const isPasswordValid = await bcrypt.compare(password, foundUser.password);

		if (!isPasswordValid) {
			return {
				success: false,
				message: 'Invalid username or password'
			};
		}

		// 3. Create JWT token with user data
		const token = jwt.sign(
			{
				id: foundUser.id,
				username: foundUser.username,
				role: foundUser.role
			},
			JWT_SECRET,
			{ expiresIn: '24h' }
		);

		// 4. Remove password from response
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
 *
 * Change user password
 * @param {number} userId - User's ID
 * @param {string} currentPassword - Current password (plain text)
 * @param {string} newPassword - New password (plain text)
 * @returns {Object} Result object
 *
 **/

export const CHANGE_PASSWORD_SERVICES = async (userId, currentPassword, newPassword) => {
	try {
		// 1. Get user from database
		const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

		if (!user || user.length === 0) {
			return {
				success: false,
				message: 'User not found'
			};
		}

		const foundUser = user[0];

		// 2. Verify current password
		const isPasswordValid = await bcrypt.compare(currentPassword, foundUser.password);

		if (!isPasswordValid) {
			return {
				success: false,
				message: 'Current password is incorrect'
			};
		}

		// 3. Hash new password
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);

		// 4. Update password in database
		await db.update(users).set({ password: hashedNewPassword }).where(eq(users.id, userId));

		return {
			success: true,
			message: 'Password changed successfully'
		};
	} catch (error) {
		console.error('Change password service error:', error);
		return {
			success: false,
			message: 'Internal server error'
		};
	}
};

/**
 *
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token data or null if invalid
 *
 **/
export const VERIFY_TOKEN_SERVICES = (token) => {
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
