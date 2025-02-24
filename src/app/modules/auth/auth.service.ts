import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import User from "../../Schema/User";
import { TUser } from "../user/user.interface";
import { jwtHelpers } from "../../utils/jwtHelpers";
import config from "../../config";

//! Register a new user
const registerService = async (userData: TUser) => {
  const { displayName, phoneNumber, email, password, role } = userData;

  // Hash password only if provided
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  // Upsert user: Update if exists, otherwise create
  const user = await User.findOneAndUpdate(
    { email },
    {
      displayName,
      phoneNumber: phoneNumber || null,
      password: hashedPassword || null,
      role: role || "customer",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Generate JWT Token
  const accessToken = jwtHelpers.generateToken(
    {
      _id: user._id,
      role: user.role,
      email: user.email,
    },
    config.jwt_access_secret!,
    config.jwt_access_expires_in!
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      role: userData.role,
      email: userData.email,
    },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { user, accessToken, refreshToken };
};

//! Login
const loginService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Generate JWT Token
  const accessToken = jwtHelpers.generateToken(
    {
      _id: user._id,
      role: user.role,
      email: user.email,
    },
    config.jwt_access_secret!,
    config.jwt_access_expires_in!
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { user, accessToken, refreshToken };
};

//! Refresh Token Service
const refreshTokenService = async (token: string) => {
  // Verify the refresh token
  const decodedData = jwtHelpers.verifyToken(token, config.jwt_refresh_secret as string);

  if (!decodedData?.email) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token data!");
  }

  // Find user in DB
  const user = await User.findOne({ email: decodedData.email });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found!");
  }

  // Generate new access token
  const accessToken = jwtHelpers.generateToken(
    {
      _id: user._id,
      role: user.role,
      email: user.email,
    },
    config.jwt_access_secret!,
    config.jwt_access_expires_in!
  );

  return { accessToken };
};

//! Get my profile
const getMeService = async (user: JwtPayload) => {
  return await User.findById(user._id).populate("profile");
};

export const AuthServices = {
  registerService,
  loginService,
  refreshTokenService,
  getMeService,
};
