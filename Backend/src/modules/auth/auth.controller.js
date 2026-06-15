import * as authService from "./auth.service.js";
import { STATUS } from "../../utils/constants/status.js";
import { ROLES } from "../../utils/constants/roles.js";

//SIGNUP 

export const signupController = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.signupService({
      name,
      email,
      password,
      role: role || ROLES.USER,
    });

    return res.status(STATUS.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN 
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginService({ email, password });

    return res.status(STATUS.OK).json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

//  FORGOT PASSWORD 
export const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPasswordService(email);

    return res.status(STATUS.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// RESET PASSWORD 
export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    const result = await authService.resetPasswordService({
      token,
      password,
      confirmPassword,
    });

    return res.status(STATUS.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY OTP 
export const verifyOtpController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const result = await authService.verifyOtpService({ email, otp });

    return res.status(STATUS.CREATED).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

// RESEND OTP 
export const resendOtpController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.resendOtpService(email);

    return res.status(STATUS.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};