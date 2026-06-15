import * as userService from "./user.service.js";
import { STATUS } from "../../utils/constants/status.js";
import { ROLES } from "../../utils/constants/roles.js";
import { successResponse } from "../../utils/response.js";

export const getUserProfileController = async (req, res, next) => {
  try {
    const user = await userService.getProfileService(req.user.id);
    return successResponse(res, "Profile fetched successfully.", STATUS.OK, {
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    const result = await userService.changePasswordService({
      userId: req.user.id,
      oldPassword,
      password,
      confirmPassword,
    });
    return successResponse(res, result.message, STATUS.OK);
  } catch (err) {
    next(err);
  }
};

// UPDATE PROFILE CONTROLLER
export const updateProfile = async (req, res, next) => {
  try {
    const files = req.uploadedFiles ?? [];

    const updatedUser = await userService.updateProfileService(
      req.user.id,
      req.body,
      files,
    );

    return successResponse(res, "Profile updated successfully.", STATUS.OK, {
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
