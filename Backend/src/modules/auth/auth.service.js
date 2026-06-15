import { hashPassword, comparePasswords } from "../../utils/bcrypt.js";
import { generateTokens } from "../../utils/jwt.js";
import User from "../user/user.model.js";
import redis from "../../config/redis.js";
import { emailQueue } from "../../jobs/queues/email.queue.js";
import { generateOTP } from "../../utils/generateOtp.js";
import { AppError } from "../../utils/appError.js";
import { AUTH_MESSAGES } from "../../utils/constants/messages.js";
import { REDIS_KEYS } from "../../utils/constants/redisKeys.js";
import { ROLES } from "../../utils/constants/roles.js";
import { STATUS } from "../../utils/constants/status.js";
import crypto from "crypto";

const OTP_EXPIRE = 300;

// SIGNUP 
export const signupService = async ({
    name,
    email,
    password,
    role = ROLES.USER,
}) => {
    const user = await User.findOne({ where: { email } });

    if (user) {
        throw new AppError(AUTH_MESSAGES.USER_EXISTS, STATUS.CONFLICT);
    }

    const otp = generateOTP();
    const hash = await hashPassword(password);

    await redis.set(REDIS_KEYS.OTP(email), otp, { EX: OTP_EXPIRE });

    await redis.set(
        REDIS_KEYS.SIGNUP(email),
        JSON.stringify({ name, email, password: hash, role }),
        { EX: OTP_EXPIRE },
    );

    await emailQueue.add("send-otp", { email, otp });

    return { message: AUTH_MESSAGES.OTP_SENT };
};

// LOGIN 
export const loginService = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS.NOT_FOUND);
    }

    if (!user.isVerified) {
        throw new AppError(AUTH_MESSAGES.VERIFY_ACCOUNT, STATUS.UNAUTHORIZED);
    }

    if (!user.isActive) {
        throw new AppError(AUTH_MESSAGES.ACCOUNT_BLOCKED, STATUS.FORBIDDEN);
    }

    const match = await comparePasswords(password, user.password);

    if (!match) {
        throw new AppError(AUTH_MESSAGES.INVALID_PASSWORD, STATUS.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return { accessToken, refreshToken, user };
};

//FORGOT PASSWORD 
export const forgotPasswordService = async (email) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS.NOT_FOUND);
    }

    const token = crypto.randomBytes(32).toString("hex");

    await redis.set(REDIS_KEYS.RESET(token), email, { EX: 900 });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await emailQueue.add("forgot-password", {
        email,
        name: user.name,
        resetLink,
    });

    return { message: AUTH_MESSAGES.PASSWORD_RESET_LINK };
};

// RESET PASSWORD 

export const resetPasswordService = async ({
    token,
    password,
    confirmPassword,
}) => {
    if (password !== confirmPassword) {
        throw new AppError(AUTH_MESSAGES.PASSWORD_MISMATCH, STATUS.BAD_REQUEST);
    }

    const email = await redis.get(REDIS_KEYS.RESET(token));

    if (!email) {
        throw new AppError(AUTH_MESSAGES.INVALID_RESET_TOKEN, STATUS.BAD_REQUEST);
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS.NOT_FOUND);
    }

    const isSame = await comparePasswords(password, user.password);

    if (isSame) {
        throw new AppError(AUTH_MESSAGES.SAME_PASSWORD, STATUS.BAD_REQUEST);
    }

    user.password = await hashPassword(password);
    await user.save();

    await redis.del(REDIS_KEYS.RESET(token));

    return { message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS };
};

//VERIFY OTP

export const verifyOtpService = async ({ email, otp }) => {
    const redisOtp = await redis.get(REDIS_KEYS.OTP(email));

    if (!redisOtp) {
        throw new AppError(AUTH_MESSAGES.OTP_EXPIRED, STATUS.BAD_REQUEST);
    }

    if (redisOtp != otp) {
        throw new AppError(AUTH_MESSAGES.INVALID_OTP, STATUS.BAD_REQUEST);
    }

    const signupData = await redis.get(REDIS_KEYS.SIGNUP(email));

    if (!signupData) {
        throw new AppError(AUTH_MESSAGES.SIGNUP_EXPIRED, STATUS.BAD_REQUEST);
    }

    const data = JSON.parse(signupData);

    const user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || ROLES.USER,
        isVerified: true,
    });

    await redis.del(REDIS_KEYS.OTP(email));
    await redis.del(REDIS_KEYS.SIGNUP(email));

    await emailQueue.add("welcome", { email: user.email, name: user.name });

    return { message: AUTH_MESSAGES.ACCOUNT_CREATED, user };
};

// RESEND OTP 

export const resendOtpService = async (email) => {
    const signupData = await redis.get(REDIS_KEYS.SIGNUP(email));

    if (!signupData) {
        throw new AppError(AUTH_MESSAGES.SIGNUP_EXPIRED, STATUS.BAD_REQUEST);
    }

    const otp = generateOTP();

    await redis.set(REDIS_KEYS.OTP(email), otp, { EX: OTP_EXPIRE });

    await emailQueue.add("send-otp", { email, otp });

    return { message: AUTH_MESSAGES.OTP_RESENT };
};
