import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../../config";
import User from "../../Schema/User";
import ApiError from "../../errors/ApiError";
import { TUser } from "../../interface/user";

//! Register a new user
export const registerService = async (userData: TUser) => {
  const { name, email, phoneNumber, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
    role: role || "user",
    isEmailVerified: false,
  });

  return newUser;
};

//! Login a user
export const loginService = async (loginData: TUser) => {
  const { email, password } = loginData;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found!");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user._id, role: user.role }, config.jwt_access_secret as string, { expiresIn: "7d" });

  return { user, token };
};

export const AuthServices = {
  registerService,
  loginService,
};
