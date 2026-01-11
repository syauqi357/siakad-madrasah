import { verifyTokenService } from '../services/authService.js';

// Verify token middlewares
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
