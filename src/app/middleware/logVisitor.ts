import { NextFunction, Request, Response } from "express";
import { VisitorLog } from "../Schema/VisitorLog";

export const logVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.connection.remoteAddress || "Unknown";
    const userAgent = req.headers["user-agent"] || "Unknown";

    await VisitorLog.create({
      ip,
      userAgent,
      userId: req.user?._id || null, // Optional: if user is logged in
    });
  } catch (err: any) {
    console.error("Visitor log failed:", err.message);
  }

  next(); // Always proceed
};
