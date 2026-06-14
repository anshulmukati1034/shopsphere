import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Gmail Transporter (App Password based)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // your gmail
    pass: process.env.SMTP_PASS, // gmail app password
  },
});

// Optional: verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Error:", error);
  } else {
    console.log("✅ Gmail SMTP Ready");
  }
});

// -------------------------
// 📩 OTP Email
// -------------------------
export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Account",
    html: `
      <div style="font-family:Arial;padding:20px;">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:5px;">${otp}</h1>
        <p>OTP expires in 5 minutes.</p>
      </div>
    `,
  });
};

// -------------------------
// 🎉 Welcome Email
// -------------------------
export const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome!",
    html: `
      <div style="font-family:Arial;padding:20px;">
        <h2>Welcome ${name} 🎉</h2>
        <p>Your account has been created successfully.</p>
      </div>
    `,
  });
};

// -------------------------
// 🔐 Forgot Password Email
// -------------------------
export const sendForgotPasswordEmail = async (email, name, resetLink) => {
  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="max-width:600px;margin:auto;padding:20px;font-family:Arial;">
        <h2>Hello ${name},</h2>

        <p>We received a request to reset your password.</p>

        <a href="${resetLink}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#007bff;
            color:white;
            text-decoration:none;
            border-radius:5px;
            margin-top:10px;
          ">
          Reset Password
        </a>

        <p style="margin-top:20px;">Or copy this link:</p>
        <p>${resetLink}</p>

        <p style="margin-top:20px;">
          This link expires in <b>15 minutes</b>.
        </p>

        <p>
          If you did not request this, ignore this email.
        </p>
      </div>
    `,
  });
};