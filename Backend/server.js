import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./src/config/db.js";

import "./src/database/index.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());



const startServer = async () => {
  try {
    // Connect DB and sync models
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();