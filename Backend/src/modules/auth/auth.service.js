import { hashPassword, comparePasswords } from "../../utils/bcrypt.js";
import { generateTokens } from "../../utils/jwt.js";
import User from "../user/user.model.js";
import redis from "../../config/redis.js";
import { emailQueue } from "../../jobs/queues/email.queue.js";
import { generateOTP } from "../../utils/generateOtp.js";
import crypto from "crypto";

const OTP_EXPIRE = 300;

// SIGNUP

export const signupService = async ({ name, email, password, role = "user" }) => {
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (user) {
        throw new Error("User already exists");
    }

    const otp = generateOTP();

    const hash = await hashPassword(password);

    await redis.set(`otp:${email}`, otp, {
        EX: OTP_EXPIRE,
    });

    await redis.set(
        `signup:${email}`,

        JSON.stringify({
            name,
            email,
            password: hash,
            role,
        }),

        {
            EX: OTP_EXPIRE,
        },
    );

    await emailQueue.add("send-otp", {
        email,
        otp,
    });

    return {
        message: "OTP sent successfully",
    };
};

export const loginService = async ({ email, password }) => {
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.isVerified) {
        throw new Error("Verify your account first");
    }

    if (!user.isActive) {
        throw new Error("Account blocked");
    }

    const match = await comparePasswords(password, user.password);

    if (!match) {
        throw new Error("Invalid password");
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return {
        accessToken,
        refreshToken,
        user,
    };
};

export const forgotPasswordService = async (email) => {
    // Check User

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Generate Random Token

    const token = crypto.randomBytes(32).toString("hex");

    // Save in Redis

    await redis.set(`reset:${token}`, email, {
        EX: 900,
    });

    // Create Reset Link

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Add Email Job

    await emailQueue.add("forgot-password", {
        email,
        name: user.name,
        resetLink,
    });

    return {
        message: "Password reset link sent",
    };
};

export const resetPasswordService = async ({
    token,
    password,
    confirmPassword,
}) => {
    // Validate Password & Confirm Password Match (confirmPassword is validation-only, not stored in DB)

    if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }

    // Check Token

    const email = await redis.get(`reset:${token}`);

    if (!email) {
        throw new Error("Reset link expired or invalid");
    }

    // Find User

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Hash Password

    const hashedPassword = await hashPassword(password);

    const isSame = await comparePasswords(password, user.password);

    if (isSame) {
        throw new Error("New password must be different from the old password");
    }

    // Update Password

    user.password = hashedPassword;

    await user.save();

    // Delete Reset Token

    await redis.del(`reset:${token}`);

    return {
        message: "Password reset successful",
    };
};

// VERIFY OTP
export const verifyOtpService = async ({ email, otp }) => {
    const redisOtp = await redis.get(`otp:${email}`);

    if (!redisOtp) {
        throw new Error("OTP expired");
    }

    if (redisOtp != otp) {
        throw new Error("Invalid OTP");
    }

    const signupData = await redis.get(`signup:${email}`);

    if (!signupData) {
        throw new Error("Signup expired");
    }

    const data = JSON.parse(signupData);

    const user = await User.create({
        name: data.name,

        email: data.email,

        password: data.password,

        role: data.role || "user",

        isVerified: true,
    });

    await redis.del(`otp:${email}`);

    await redis.del(`signup:${email}`);

    await emailQueue.add("welcome", {
        email: user.email,

        name: user.name,
    });

    return {
        message: "Account created",

        user,
    };
};

export const resendOtpService = async (email) => {
    const signupData = await redis.get(`signup:${email}`);

    if (!signupData) {
        throw new Error("Signup expired");
    }

    const otp = generateOTP();

    await redis.set(`otp:${email}`, otp, {
        EX: 300,
    });

    await emailQueue.add("send-otp", {
        email,
        otp,
    });

    return {
        message: "OTP resent",
    };
};
