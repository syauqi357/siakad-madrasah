import { authenticateUser, verifyTokenService } from '../services/authService.js';

// Login controller
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Call service layer to authenticate
		const result = await authenticateUser(username, password); // ← ADD AWAIT!

		if (!result.success) {
			return res.status(result.message === 'Username and password are required' ? 400 : 401).json({
				success: false,
				message: result.message
			});
		}

		return res.status(200).json(result);
	} catch (error) {
		console.error('Login controller error:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Logout controller
export const logout = async (req, res) => {
	try {
		// JWT logout is handled on the client side by removing the token
		return res.status(200).json({
			success: true,
			message: 'Logout successful'
		});
	} catch (error) {
		console.error('Logout controller error:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Verify token middleware
export const verifyToken = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		// Call service layer to verify token
		const result = verifyTokenService(token);

		if (!result.success) {
			return res.status(401).json({
				success: false,
				message: result.message
			});
		}

		// Attach decoded user info to request
		req.user = result.decoded;
		next();
	} catch (error) {
		console.error('Token verification controller error:', error); // debug code
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token'
		});
	}
};
