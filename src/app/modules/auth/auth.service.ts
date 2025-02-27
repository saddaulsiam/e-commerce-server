import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import Profile from "../../Schema/Profile";
import User from "../../Schema/User";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { TUser } from "../user/user.interface";

//! Register a new user
const registerService = async (userData: TUser) => {
  const { displayName, phoneNumber, email, password, role } = userData;

  // Start a Mongoose transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  // Check if the user already exists
  let user = await User.findOne({ email }).populate("profile");
  if (user) {
    // Ensure the profile exists
    if (!user.profile) {
      const profile = await Profile.create([{ userId: user._id, address: [], photo: "", orders: [] }], { session });
      user.profile = profile[0]._id;
      await user.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Generate and return tokens for existing user
    const accessToken = jwtHelpers.generateToken(
      { id: user._id, role: user.role, email: user.email },
      config.jwt_access_secret!,
      config.jwt_access_expires_in!
    );

    const refreshToken = jwtHelpers.generateToken(
      { id: user._id, role: user.role, email: user.email },
      config.jwt_refresh_secret!,
      config.jwt_refresh_expires_in!
    );

    return { user, accessToken, refreshToken };
  }

  // Hash password
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  // Create the user inside the transaction
  user = new User({ displayName, phoneNumber, email, password: hashedPassword, role });
  await user.save({ session });

  // Create profile for new user
  const profile = await Profile.create([{ userId: user._id, address: [], photo: "", orders: [] }], { session });
  user.profile = profile[0]._id;
  await user.save({ session });

  // Commit the transaction
  await session.commitTransaction();
  session.endSession();

  // Generate JWT Tokens
  const accessToken = jwtHelpers.generateToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt_access_secret!,
    config.jwt_access_expires_in!
  );

  const refreshToken = jwtHelpers.generateToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt_refresh_secret!,
    config.jwt_refresh_expires_in!
  );

  return { user, accessToken, refreshToken };
};

//! Login
const loginService = async (email: string) => {
  const user = await User.findOne({ email }).populate("profile");
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
