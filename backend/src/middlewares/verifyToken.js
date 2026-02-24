import { VERIFY_TOKEN_SERVICES } from '../services/auth.service.js';

// Verify token middlewares
export const VERIFY_TOKEN_MIDDLEWARE = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({
			success: false,
			message: 'No token provided'
		});
	}

	const decoded = VERIFY_TOKEN_SERVICES(token);

	if (!decoded) {
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token'
		});
	}

	// Attach decoded user info to request
	req.user = decoded;
	next();
};
