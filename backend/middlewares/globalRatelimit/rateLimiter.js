import rateLimit from 'express-rate-limit';

export const GLOBAL_RATE_LIMIT = rateLimit({
	/*
	 *
	 * catch source from :
	 * https://stackoverflow.com/questions/58486616/express-rate-limit-catching-the-message
	 *
	 * docs :
	 * https://www.npmjs.com/package/express-rate-limit
	 * */
	windowMs: 15 * 60 * 1000, // 15 minutes
	message: 'too many request, please try again few minutes later',
	max: 300,
	standardHeaders: true,
	legacyHeaders: false,
	statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
	headers: true, //Send custom rate limit header with limit and remaining
	skipFailedRequests: false, // Do not count failed requests (status >= 400)
	skipSuccessfulRequests: false // Do not count successful requests (status < 400)
});
