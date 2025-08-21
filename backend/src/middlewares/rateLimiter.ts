//File: src/middlewares/rateLimiter.ts
import rateLimit from 'express-rate-limit';

/**
 * @swagger
 * components:
 *   responses:
 *     TooManyRequests:
 *       description: Too many requests from this IP, please try again later
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Too many requests, please try again later
 *               retryAfter:
 *                 type: number
 *                 description: Seconds to wait before next request
 * 
 * @swagger
 * components:
 *   parameters:
 *     RateLimitHeaders:
 *       in: header
 *       name: X-RateLimit-Limit
 *       schema:
 *         type: integer
 *       description: Request limit per time window
 *     RateLimitRemaining:
 *       in: header
 *       name: X-RateLimit-Remaining
 *       schema:
 *         type: integer
 *       description: The number of requests left for the time window
 *     RateLimitReset:
 *       in: header
 *       name: X-RateLimit-Reset
 *       schema:
 *         type: integer
 *       description: The timestamp (Unix epoch) when the rate limit resets
 */

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});