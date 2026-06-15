import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { testConnection } from "./src/config/db.js";
import Redis, { connectRedis } from "./src/config/redis.js";
import { globalLimiter } from "./src/middleware/rateLimit.middleware.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import { emailWorker } from "./src/jobs/workers/email.worker.js";
import routes from "./src/routes/index.js";

dotenv.config();
import "./src/database/index.js"; 



const app = express();
const PORT = process.env.PORT || 5005;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(helmet());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(globalLimiter);
app.use("/api/v1", routes);

// global error handler must be registered after all routes/middleware
app.use(errorHandler);

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