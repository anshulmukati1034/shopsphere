import * as userService from "./user.service.js";
import { STATUS } from "../../utils/constants/status.js";
import { ROLES } from "../../utils/constants/roles.js";

export const getUserProfileController = async (req, res) => {
  try {
    const user = await userService.getProfileService(req.user.id);
    return res.status(STATUS.OK).json({ success: true, user });
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    const result = await userService.changePasswordService({
      userId: req.user.id,
      oldPassword,
      password,
      confirmPassword,
    });
    return res.status(STATUS.OK).json({ success: true, message: result.message });
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

// UPDATE PROFILE CONTROLLER
export const updateProfile = async (req, res, next) => {
  try {
    const files = req.uploadedFiles ?? [];
 
    const updatedUser = await userService.updateProfileService(req.user.id, req.body, files);
 
    return res.status(STATUS.OK).json({
      success: true,
      message: "Profile updated successfully.",
      data: { user: updatedUser },
    });
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).json({ success: false, message: err.message });
  }
};
 
