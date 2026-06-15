export const REDIS_KEYS = {
  USER: (id) => `user:${id}`,
  OTP: (email) => `otp:${email}`,
  SIGNUP: (email) => `signup:${email}`,
  RESET: (token) => `reset:${token}`,
};