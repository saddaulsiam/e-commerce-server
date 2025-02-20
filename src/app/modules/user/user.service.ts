import AppError from "../../errors/AppError";
import User from "../../Schema/User";
import Profile from "../../Schema/Profile";
import httpStatus from "http-status";

//! Get all users
export const getAllUsersService = async () => {
  const users = await User.find();
  return users;
};

//! Get user by ID
export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

//! Delete user by ID
export const deleteUserService = async (userId: string) => {
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
export const getUserProfileService = async (userId: string) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }
  return profile;
};

//! Update user profile
export const updateUserProfileService = async (userId: string, updateData: any) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }

  // Update the profile with new data
  const updatedProfile = await Profile.findOneAndUpdate({ userId }, updateData, { new: true });
  return updatedProfile;
};

export const UsersServices = {
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
  getUserProfileService,
  updateUserProfileService,
};
