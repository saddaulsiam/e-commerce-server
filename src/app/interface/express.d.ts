import { User } from "../Schema/User";
import { Request } from "express";

// Extending Express's Request interface to include the `user` property
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
