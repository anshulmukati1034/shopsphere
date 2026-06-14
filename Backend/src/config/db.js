import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.PG_DATABASE,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST || "localhost",
  port: Number(process.env.PG_PORT) || 5432,
  dialect: "postgres",

  logging: false,

  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  dialectOptions:
    process.env.PG_SSL === "true"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

export const testConnection = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    // Sync models
    await sequelize.sync(); // Use { force: true } for development to drop and recreate tables
    console.log("✅ Database synced successfully");
  } catch (error) {
    console.error("❌ Database error:", error.message);
    process.exit(1);
  }
};

export default sequelize;