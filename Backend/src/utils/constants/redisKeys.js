export const REDIS_KEYS = {
  OTP: (email) => `otp:${email}`,
  SIGNUP: (email) => `signup:${email}`,
  RESET: (token) => `reset:${token}`,
};