import redis from "../config/redis.js";

/*
|--------------------------------------------------------------------------
| Generic Redis Rate Limiter
|--------------------------------------------------------------------------
*/

export const rateLimit = ({
  window = 60, // seconds
  limit = 10,
  message = "Too many requests, try again later",
  keyGenerator,
}) => {
  return async (req, res, next) => {
    try {
      const key = keyGenerator(req);

      const count = await redis.incr(key);

      // first request → set expiry
      if (count === 1) {
        await redis.expire(key, window);
      }

      // limit exceeded
      if (count > limit) {
        return res.status(429).json({
          success: false,
          message,
        });
      }

      next();
    } catch (error) {
      // fail open (don’t block API if redis fails)
      console.error("Rate limit error:", error);
      next();
    }
  };
};

/*
|--------------------------------------------------------------------------
| AUTH LIMITERS
|--------------------------------------------------------------------------
*/

// Global limiter
export const globalLimiter = rateLimit({
  window: 15 * 60, // 15 min
  limit: 100, // total requests per IP
  message: "Too many requests from this IP",
  keyGenerator: (req) => `global:${req.ip}`,
});


// Login limiter
export const authLimiter = rateLimit({
  window: 15 * 60, // 15 min
  limit: 5,
  message: "Too many login attempts. Try again after 15 minutes",
  keyGenerator: (req) =>
    `login:${req.ip}:${req.body.email || "unknown"}`,
});


// OTP limiter
export const otpLimiter = rateLimit({
  window: 5 * 60,
  limit: 3,
  message: "Too many OTP requests. Please wait 5 minutes",
  keyGenerator: (req) =>
    `otp:${req.ip}:${req.body.email || "unknown"}`,
});

