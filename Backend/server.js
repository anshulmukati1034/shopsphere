import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { testConnection } from "./src/config/db.js";
import Redis, { connectRedis } from "./src/config/redis.js";
import { globalLimiter } from "./src/middleware/rateLimit.middleware.js";
import { emailWorker } from "./src/jobs/workers/email.worker.js";
import routes from "./src/routes/index.js";

import "./src/database/index.js"; 



const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());
app.use(globalLimiter);
app.use("/api/v1", routes);

const startServer = async () => {
  try {
    // Connect DB and sync models
    await testConnection();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();