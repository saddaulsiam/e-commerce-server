import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UsersServices } from "./user.service";

// Get all users
const getAllUsers = catchAsync(async (_req, res) => {
  const result = await UsersServices.getAllUsersService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});

// Get user by ID
const getUserById = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UsersServices.getUserByIdService(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

// Delete user by ID
const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UsersServices.deleteUserService(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully!",
    data: result,
  });
});

// Get user profile
const getUserProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await UsersServices.getUserProfileService(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

// Update user profile
const updateUserProfile = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  const result = await UsersServices.updateUserProfileService(userId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully!",
    data: result,
  });
});

//! Add New Address
const addNewAddress = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  const result = await UsersServices.addNewAddressService(userId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New Address added successfully!",
    data: result,
  });
});

//! Add New Address
const deleteAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.id;

  const result = await UsersServices.deleteAddressService(userId, addressId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Removed address successfully!",
    data: result,
  });
});

export const UsersControllers = {
  getAllUsers,
  getUserById,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  addNewAddress,
  deleteAddress,
};
