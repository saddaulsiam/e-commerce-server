import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import notFound from "./app/middleware/APINotFound";
import { corsOptions } from "./app/middleware/corsOptions";
import globalErrorHandler from "./app/middleware/globalErrorhandler";
import router from "./app/routes";

const app = express();

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_req, res) => {
  res.send("Siam Store server is running😊...");
});
app.use("/api/v1", router);

// Error Handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;
