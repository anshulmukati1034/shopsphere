import * as userService from "./user.service.js";

export const getUserProfileController = async (req, res) => {
  try {
    const user = await userService.getProfileService(req.user.id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
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
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE PROFILE CONTROLLER
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await userService.updateProfileService(
      userId,
      req.body,
      req.file
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};