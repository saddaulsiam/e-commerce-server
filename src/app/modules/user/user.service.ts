import AppError from "../../errors/AppError";
import User from "../../Schema/User";
import Profile from "../../Schema/Profile";
import httpStatus from "http-status";
import { TAddress } from "./user.interface";
import mongoose from "mongoose";

//! Get all users
const getAllUsersService = async () => {
  const users = await User.find();
  return users;
};

//! Get user by ID
const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

//! Delete user by ID
const deleteUserService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Delete the user profile if exists
  await Profile.findOneAndDelete({ userId });

  // Delete the user
  await User.findByIdAndDelete(userId);
  return { message: "User deleted successfully" };
};

//! Get user profile
const getUserProfileService = async (userId: string) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }
  return profile;
};

//! Update user profile
const updateUserProfileService = async (userId: string, updateData: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const profile = await User.findById(userId).session(session);
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
    }

    const userUpdateData = {
      displayName: updateData.displayName,
      phoneNumber: updateData.phoneNumber,
    };

    const profileUpdateData = {
      birthDate: updateData.birthDate,
      photo: updateData.photo,
    };

    await User.findOneAndUpdate({ _id: userId }, userUpdateData, { new: true, session });

    await Profile.findOneAndUpdate({ userId }, profileUpdateData, { new: true, session });

    await session.commitTransaction();
    session.endSession();

    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//! Add New Address
const addNewAddressService = async (userId: string, addressData: TAddress) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }

  // Update the profile with new data
  const updatedProfile = await Profile.findOneAndUpdate({ userId }, { $push: { address: addressData } }, { new: true });
  return updatedProfile;
};

//! Delete Address Service
const deleteAddressService = async (userId: string, addressId: string) => {
  const updatedProfile = await Profile.findOneAndUpdate(
    { userId },
    { $pull: { address: { _id: addressId } } },
    { new: true }
  );

  if (!updatedProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }
  return updatedProfile;
};

export const UsersServices = {
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
  getUserProfileService,
  updateUserProfileService,
  addNewAddressService,
  deleteAddressService,
};
