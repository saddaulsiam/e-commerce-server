import jwt from "jsonwebtoken";
import config from "../config";

export const generateToken = (payload: object) => {
  const secretKey = config.jwt_access_secret as string;

  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign(payload, secretKey, { expiresIn: config.jwt_access_expires_in as string });
};
