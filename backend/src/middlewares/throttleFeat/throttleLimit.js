import slowDown from 'express-slow-down';

export const speedLimit = slowDown({
	windowMs: 15 * 60 * 1000, // 15 minutes
	delayAfter: 5, // Allow 5 requests per 15 minutes.
	delayMs: (hits) => hits * 100 // Add 100 ms of delay to every request after the 5th one.

	/**
	 * So:
	 *
	 * - requests 1-5 are not delayed.
	 * - request 6 is delayed by 600ms
	 * - request 7 is delayed by 700ms
	 * - request 8 is delayed by 800ms
	 *
	 * and so on. After 15 minutes, the delay is reset to 0.
	 */
});
