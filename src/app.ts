import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import notFound from "./app/middleware/APINotFound";
import globalErrorHandler from "./app/middleware/globalErrorhandler";
import router from "./app/routes";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000", "https://siam-store24.vercel.app"], credentials: true }));

// Routes
app.use("/api/v1", router);

app.get("/", (_req, res) => {
  res.send("Server is Running !");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
