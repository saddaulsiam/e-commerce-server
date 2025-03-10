import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import SubOrder from "../../Schema/SubOrder";
import User from "../../Schema/User";
import Vendor from "../../Schema/Vendor";
import { USER_ROLE } from "../user/user.constant";
import { TVendor } from "./vendor.interface";
import { calculatePagination } from "../../utils/paginationHelper";

//! Create Vendor with Transaction
export const createVendorService = async (vendorData: TVendor) => {
  // Start a Mongoose session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if StoreName is exists
    const existVendorByStoreName = await Vendor.findOne({ storeName: vendorData.storeName }).session(session);
    if (existVendorByStoreName) {
      throw new AppError(httpStatus.BAD_REQUEST, "Store Name exists");
    }

    // Check if vendor already exists using the session
    const existingVendor = await Vendor.findOne({ userId: vendorData.userId }).session(session);
    if (existingVendor) {
      throw new AppError(httpStatus.BAD_REQUEST, "Vendor already exists");
    }

    // Create new vendor using the session
    const newVendor = await Vendor.create([vendorData], { session });

    // Update user's role using the session
    await User.findByIdAndUpdate(vendorData.userId, { $set: { role: USER_ROLE.vendor } }, { new: true, session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return newVendor[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!", error);
  }
};

//! Get all vendors
export const getAllVendorsService = async () => {
  const vendors = await Vendor.find();
  return vendors;
};

//! Get vendor by UserID
export const getVendorByUserIdService = async (userId: string) => {
  const vendor = await Vendor.findOne({ userId: userId });
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return vendor;
};

//! Update vendor by ID
export const updateVendorService = async (vendorId: string, updateData: Partial<TVendor>) => {
  const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true });
  if (!updatedVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return updatedVendor;
};

//! Delete vendor by ID
export const deleteVendorService = async (vendorId: string) => {
  const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
  if (!deletedVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return { message: "Vendor deleted successfully" };
};

//! Get customers by vendor
export const getVendorCustomersService = async (params: any, options: any) => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  // Step 1: Find orders by vendorId and select only userId
  const orders = await SubOrder.find({ vendorId: filterData.vendorId }).select("userId");

  // Step 2: Extract unique userIds
  const uniqueUserIds = [...new Set(orders.map((order) => order.userId.toString()))];

  // If no users, return empty data
  if (uniqueUserIds.length === 0) {
    return {
      meta: { page, limit, total: 0 },
      data: [],
    };
  }

  // Step 3: Build search query
  const query: any = { _id: { $in: uniqueUserIds } };

  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { phoneNumber: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Step 4: Sorting
  const sortOptions: { [key: string]: 1 | -1 } = {};
  if (options.sortBy && options.sortOrder) {
    sortOptions[options.sortBy as string] = options.sortOrder === "asc" ? 1 : -1;
  } else {
    sortOptions.createdAt = -1;
  }

  // Step 5: Fetch user data with pagination
  const users = await User.find(query).populate("profile").sort(sortOptions).skip(skip).limit(limit);

  const total = await User.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: users,
  };
};

export const VendorsServices = {
  createVendorService,
  getAllVendorsService,
  getVendorByUserIdService,
  updateVendorService,
  deleteVendorService,
  getVendorCustomersService,
};
