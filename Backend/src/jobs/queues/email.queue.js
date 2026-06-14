import { Queue } from "bullmq";
import bullRedis from "../../config/bullmq.js";

export const emailQueue = new Queue(
  "emailQueue",
  {
    connection: bullRedis,

    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 2000,
      },

      removeOnComplete: 100,

      removeOnFail: 50,
    },
  }
);