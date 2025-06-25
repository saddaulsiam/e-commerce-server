import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import Profile from "../../Schema/Profile";
import User from "../../Schema/User";
import { calculatePagination } from "../../utils/paginationHelper";
import { orderSearchAbleFields } from "./user.constant";
import { TAddress } from "./user.interface";
import { TStatus } from "../vendor/vendor.interface";

//! Get all users
const getAllUsersService = async (params: any, options: any) => {
  const { page, limit, skip } = calculatePagination(options);
  const { date, searchTerm, ...filterData } = params;

  const query: any = {};

  if (searchTerm) {
    query.$or = orderSearchAbleFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    }));
  }

  if (Object.keys(filterData).length > 0) {
    Object.keys(filterData).forEach((key) => {
      query[key] = filterData[key];
    });
  }

  const sortOptions: { [key: string]: 1 | -1 } = {};

  if (options.sortBy && options.sortOrder) {
    sortOptions[options.sortBy as string] = options.sortOrder === "asc" ? 1 : -1;
  } else {
    sortOptions.createdAt = -1;
  }

  const result = await User.find(query).sort(sortOptions).skip(skip).limit(limit).populate("profile");

  const total = await User.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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

const changeUserStatusService = async (userId: string, status: TStatus) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // Validate status
  const validStatuses: TStatus[] = [TStatus.ACTIVE, TStatus.BLOCK, TStatus.DELETED];
  if (!validStatuses.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status");
  }
  // Check if the status is already set
  if (user.status === status) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is already ${status}`);
  }
  // Update User status
  const updatedUser = await User.findByIdAndUpdate(userId, { status: status }, { new: true });

  return updatedUser;
};

export const UsersServices = {
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
  getUserProfileService,
  updateUserProfileService,
  addNewAddressService,
  deleteAddressService,
  changeUserStatusService,
};
