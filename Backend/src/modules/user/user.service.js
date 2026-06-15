import User from "../user/user.model.js";
import redis from "../../config/redis.js";
import { hashPassword, comparePasswords } from "../../utils/bcrypt.js";
import { uploadManyToCloudinary } from "../../utils/cloudinaryUpload.js";
import { AppError } from "../../utils/appError.js";
import { AUTH_MESSAGES } from "../../utils/constants/messages.js";
import { ROLES } from "../../utils/constants/roles.js";
import { STATUS } from "../../utils/constants/status.js";
import { REDIS_KEYS } from "../../utils/constants/redisKeys.js";


// GET PROFILE
export const getProfileService = async (userId) => {
  const cacheKey = REDIS_KEYS.USER(userId);

  // Check Redis
  const cachedUser = await redis.get(cacheKey);

  if (cachedUser) {
    console.log("Cache Hit");
    return JSON.parse(cachedUser);
  }

  console.log("Cache Miss");

  // Fetch from DB
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS.NOT_FOUND);
  }

  // Store in Redis for 5 minutes
  await redis.set(cacheKey, JSON.stringify(user), {
    EX: 300,
  });

  return user;
};

export const changePasswordService = async ({
  userId,
  oldPassword,
  password,
  confirmPassword,
}) => {
  if (password !== confirmPassword) {
    throw new AppError(
      AUTH_MESSAGES.PASSWORDS_DO_NOT_MATCH,
      STATUS.BAD_REQUEST,
    );
  }
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS.NOT_FOUND);
  }

  const match = await comparePasswords(oldPassword, user.password);
  if (!match)
    throw new AppError(
      AUTH_MESSAGES.OLD_PASSWORD_INCORRECT,
      STATUS.BAD_REQUEST,
    );

  const isSame = await comparePasswords(password, user.password);
  if (isSame)
    throw new AppError(AUTH_MESSAGES.SAME_PASSWORD, STATUS.BAD_REQUEST);

  const hashed = await hashPassword(password);
  user.password = hashed;
  await user.save();

  return { message: AUTH_MESSAGES.PASSWORD_CHANGED };
};

// UPDATE PROFILE SERVICE
export const updateProfileService = async (userId, data, files) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new AppError(
      AUTH_MESSAGES.USER_NOT_FOUND,
      STATUS.NOT_FOUND
    );
  }

  if (data.name !== undefined)
    user.name = data.name.trim();

  if (data.email !== undefined)
    user.email = data.email.toLowerCase().trim();

  if (files.length > 0) {
    const buffers = files.map((f) => f.buffer);
    const urls = await uploadManyToCloudinary(buffers, "profile");

    user.profileImage = urls[0];
    user.profileImages = urls;
  }

  await user.save();

  // Clear cache
  await redis.del(REDIS_KEYS.USER(userId));

  return user;
};
