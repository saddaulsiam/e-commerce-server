import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import User from "../../Schema/User";
import AppError from "../../errors/AppError";
import { TUser } from "../user/user.interface";
import { generateToken } from "../../utils/token";

//! Register a new user
export const registerService = async (userData: TUser) => {
  const { displayName, email, phoneNumber, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    displayName,
    email,
    phoneNumber,
    password: hashedPassword,
    role: role || "customer",
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
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found!");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Generate JWT Token
  const token = generateToken({ id: user._id, role: user.role, email: user.email });

  return { user, token };
};

export const AuthServices = {
  registerService,
  loginService,
};
