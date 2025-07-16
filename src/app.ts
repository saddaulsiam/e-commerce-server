import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import notFound from "./app/middleware/APINotFound";
import globalErrorHandler from "./app/middleware/globalErrorhandler";
import { logVisitor } from "./app/middleware/logVisitor";
import router from "./app/routes";

const app = express();

const corsOptions = {
  origin: "https://siam-store.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

// Apply middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logVisitor);

// Routes
app.get("/", (_req, res) => {
  res.send("Siam Store server is running😊...");
});
app.use("/api/v1", logVisitor, router);

// Error Handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;
