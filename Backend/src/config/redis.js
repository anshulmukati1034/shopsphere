import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      return Math.min(50 * Math.pow(2, retries), 5000);
    },
  },
});

redis.on("connect", () => console.log("Redis: Connecting..."));
redis.on("ready", () => console.log("Redis: Ready"));
redis.on("error", (err) => console.error("Redis Error:", err));
redis.on("end", () => console.warn("Redis: Connection closed"));
redis.on("reconnecting", () => console.log("Redis: Reconnecting..."));

export const connectRedis = async () => {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (error) {
    console.error("Redis connection failed:", error);
    process.exit(1);
  }
};

// graceful shutdown
process.on("SIGINT", async () => {
  await redis.quit();
  console.log("Redis disconnected gracefully");
  process.exit(0);
});

export default redis;