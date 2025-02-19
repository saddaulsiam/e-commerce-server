import colors from "colors/safe";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

let server: Server;

(async () => {
  try {
    if (!config.database_url) {
      throw new Error("❌ DATABASE URL is missing in .env file!");
    }

    await mongoose.connect(config.database_url).then(() => {
      console.log(colors.red("✅ Database connection is successful 🛢"));
    });

    server = app.listen(config.port, () => {
      console.log(colors.yellow(`🚀 Server is running on port ${config.port} 😎`));
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (err) => {
  console.error("😈 Unhandled Rejection detected:", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("😈 Uncaught Exception detected:", err);
  process.exit(1);
});
