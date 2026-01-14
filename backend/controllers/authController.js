import { AUTHENTICATE_USERS } from '../services/authService.js';
import { CHANGE_PASSWORD_SERVICES } from '../services/authService.js';


// Login controller
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Call service layer to authenticate
		const result = await AUTHENTICATE_USERS(username, password); // ← ADD AWAIT!

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

/**
 * Change password controller
 */
export const changePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const userId = req.user.id; // From VERIFY_TOKEN_MIDDLEWARE middlewares

		// Validation
		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: 'Current password and new password are required'
			});
		}

		if (newPassword.length < 6) {
			return res.status(400).json({
				success: false,
				message: 'New password must be at least 6 characters'
			});
		}

		if (currentPassword === newPassword) {
			return res.status(400).json({
				success: false,
				message: 'New password must be different from current password'
			});
		}

		// Call service
		const result = await CHANGE_PASSWORD_SERVICES(userId, currentPassword, newPassword);

		if (!result.success) {
			return res
				.status(result.message === 'Current password is incorrect' ? 401 : 500)
				.json(result);
		}

		return res.status(200).json(result);
	} catch (error) {
		console.error('Change password controller error:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Get current user profile
export const getSelfrec = async (req, res) => {
    try {
        // req.user is set by VERIFY_TOKEN_MIDDLEWARE middlewares
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
