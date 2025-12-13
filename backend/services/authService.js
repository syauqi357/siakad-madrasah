import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
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
export const authenticateUser = (username, password) => {
	try {
		// Validate input
		if (!username || !password) {
			return {
				success: false,
				message: 'Username and password are required'
			};
		}

		// Get accounts from guru.json
		const accounts = getAccounts();

		// Find user by username and password
		const user = accounts.find(
			account => account.username === username && account.password === password
		);

		if (!user) {
			return {
				success: false,
				message: 'Invalid username or password'
			};
		}

		// Create JWT token
		const token = jwt.sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role
			},
			JWT_SECRET,
			{ expiresIn: '24h' }
		);

		// Return user data without password
		const userResponse = {
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			nama_lengkap: user.nama_lengkap,
			jabatan: user.jabatan
		};

		return {
			success: true,
			message: 'Login successful',
			token,
			user: userResponse
		};
	} catch (error) {
		console.error('Authentication error:', error);
		return {
			success: false,
			message: 'Internal server error'
		};
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
