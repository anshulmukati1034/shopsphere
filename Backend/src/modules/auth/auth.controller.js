import * as authService from "./auth.service.js";

// Signup
export const signupController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.signupService({
      name,
      email,
      password,
      role: role || "user",
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginService({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPasswordService(email);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPasswordController = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    const result = await authService.resetPasswordService({
      token,
      password,
      confirmPassword,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify OTP
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await authService.verifyOtpService({
      email,
      otp,
    });

    return res.status(201).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await authService.resendOtpService(email);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


