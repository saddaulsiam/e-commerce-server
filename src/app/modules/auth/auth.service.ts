import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import User from "../../Schema/User";
import AppError from "../../errors/AppError";
import { generateToken } from "../../utils/token";
import { TUser } from "../user/user.interface";

//! Register a new user
export const registerService = async (userData: TUser) => {
  const { displayName, phoneNumber, email, password, role } = userData;

  // Check if user already exists
  if (await User.findOne({ email })) {
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
  const user = await User.findOne({ email }).populate("profile");
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
