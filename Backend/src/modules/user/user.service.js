import User from "../user/user.model.js";
import { hashPassword, comparePasswords } from "../../utils/bcrypt.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";


// GET PROFILE
export const getProfileService = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


export const changePasswordService = async ({ userId, oldPassword, password, confirmPassword }) => {
  if (password !== confirmPassword) throw new Error("Passwords do not match");

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const match = await comparePasswords(oldPassword, user.password);
  if (!match) throw new Error("Old password is incorrect");

  const isSame = await comparePasswords(password, user.password);
  if (isSame) throw new Error("New password must be different from the old password");

  const hashed = await hashPassword(password);
  user.password = hashed;
  await user.save();

  return { message: "Password changed successfully" };
};

// UPDATE PROFILE SERVICE
export const updateProfileService = async (userId, data, file) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // update basic fields
  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;

  // image upload
  if (file) {
    const result = await uploadToCloudinary(file.buffer, "profile");

    user.profileImage = result.secure_url; // 👈 add field in DB if not present
  }

  await user.save();

  return user;
};