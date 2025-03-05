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

  // Start a Mongoose session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user already exists (using the session)
    let user = await User.findOne({ email }).populate("profile").session(session);

    if (user) {
      // Ensure the profile exists
      if (!user.profile) {
        const profile = await Profile.create([{ userId: user._id, address: [], photo: "", orders: [] }], { session });
        user.profile = profile[0]._id;
        await user.save({ session });
      }

      // Commit the transaction and end the session
      await session.commitTransaction();
      session.endSession();

      // Generate and return tokens for the existing user
      const accessToken = jwtHelpers.generateToken(
        { _id: user._id, role: user.role, email: user.email },
        config.jwt.jwt_access_secret as string,
        config.jwt.jwt_access_expires_in as string
      );

      const refreshToken = jwtHelpers.generateToken(
        { _id: user._id, role: user.role, email: user.email },
        config.jwt.jwt_refresh_secret as string,
        config.jwt.jwt_refresh_expires_in as string
      );

      return { user, accessToken, refreshToken };
    }

    // Hash password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Create the user within the transaction
    user = new User({ displayName, phoneNumber, email, password: hashedPassword, role });
    await user.save({ session });

    // Create profile for the new user
    const profile = await Profile.create([{ userId: user._id, address: [], photo: "", orders: [] }], { session });
    user.profile = profile[0]._id;
    await user.save({ session });

    // Commit the transaction and end the session
    await session.commitTransaction();
    session.endSession();

    // Generate JWT Tokens for the new user
    const accessToken = jwtHelpers.generateToken(
      { _id: user._id, role: user.role, email: user.email },
      config.jwt.jwt_access_secret as string,
      config.jwt.jwt_access_expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
      { _id: user._id, role: user.role, email: user.email },
      config.jwt.jwt_refresh_secret as string,
      config.jwt.jwt_refresh_expires_in as string
    );

    return { user, accessToken, refreshToken };
  } catch (error: any) {
    // Commit the transaction and end the session
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!", error);
  }
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
    config.jwt.jwt_access_secret!,
    config.jwt.jwt_access_expires_in!
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      _id: user.id,
      role: user.role,
      email: user.email,
    },
    config.jwt.jwt_refresh_secret as string,
    config.jwt.jwt_refresh_expires_in as string
  );

  return { user, accessToken, refreshToken };
};

//! Refresh Token Service
const refreshTokenService = async (token: string) => {
  // Verify the refresh token
  const decodedData = jwtHelpers.verifyToken(token, config.jwt.jwt_refresh_secret as string);

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
    config.jwt.jwt_access_secret!,
    config.jwt.jwt_access_expires_in!
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
