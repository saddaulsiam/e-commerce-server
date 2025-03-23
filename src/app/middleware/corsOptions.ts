import cors from "cors";
import httpStatus from "http-status";

// List of allowed origins
const allowedOrigins = ["https://siam-store24.vercel.app"];

const corsOptions: cors.CorsOptions = {
  // Validate the incoming request origin against allowed origins
  origin: (origin, callback) => {
    if (origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Reject requests with no matching origin
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: httpStatus.NO_CONTENT,
};

export default corsOptions;
