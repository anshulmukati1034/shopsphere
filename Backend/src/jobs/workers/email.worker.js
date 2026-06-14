import { Worker } from "bullmq";
import bullRedis from "../../config/bullmq.js";

import {
  sendOTPEmail,
  sendWelcomeEmail,
  sendForgotPasswordEmail,
} from "../../services/email.service.js";

export const emailWorker = new Worker(
  "emailQueue",

  async (job) => {
    console.log("Processing Job :", job.name);

    switch (job.name) {
      case "send-otp":
        await sendOTPEmail(
          job.data.email,
          job.data.otp
        );

        console.log("OTP Email Sent");
        break;

      case "welcome":
        await sendWelcomeEmail(
          job.data.email,
          job.data.name
        );

        console.log("Welcome Email Sent");
        break;

      case "forgot-password":
        await sendForgotPasswordEmail(
          job.data.email,
          job.data.name,
          job.data.resetLink
        );

        console.log("Forgot Password Email Sent");
        break;

      default:
        console.log("Unknown Job");
    }
  },

  {
    connection: bullRedis,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed`);
  console.log(err.message);
});