import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import Product from "../../Schema/Product";
import SubOrder from "../../Schema/SubOrder";
import User from "../../Schema/User";
import Vendor from "../../Schema/Vendor";
import { generateSalesData } from "../../utils/generateSalesData";
import { calculatePagination } from "../../utils/paginationHelper";
import { OrderStatus } from "../order/order.interface";
import { USER_ROLE } from "../user/user.constant";
import { TVendor } from "./vendor.interface";
import { vendorSearchAbleFields } from "./vendor.constant";

//! Create Vendor with Transaction
const createVendorService = async (vendorData: TVendor) => {
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
    await User.findByIdAndUpdate(
      vendorData.userId,
      { $set: { role: USER_ROLE.vendor, vendor: newVendor[0]._id } },
      { new: true, session }
    );

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
const getAllVendorsService = async (params: any, options: any) => {
  const { page, limit, skip } = calculatePagination(options);
  const { date, searchTerm, ...filterData } = params;

  const query: any = {};

  if (searchTerm) {
    query.$or = vendorSearchAbleFields.map((field) => ({
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

  const result = await Vendor.find(query).sort(sortOptions).skip(skip).limit(limit);

  const total = await Vendor.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

//! Get vendor by UserID
const getVendorByUserIdService = async (userId: string) => {
  const vendor = await Vendor.findOne({ userId: userId });
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return vendor;
};

//! Get vendor by UserID
const getVendorByNameService = async (vendorName: string) => {
  const vendor = await Vendor.findOne({ storeName: vendorName });
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return vendor;
};

//! Update vendor by ID
const updateVendorService = async (vendorId: string, data: any) => {
  const updateData: Partial<TVendor> = {
    storeName: data.storeName,
    storeLogo: data.storeLogo,
    storeBanner: data.storeBanner,
    phoneNumber: data.phoneNumber,
    address: {
      street: data.street,
      city: data.city,
      area: data.area,
      address: data.address,
    },
  };

  const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true });

  if (!updatedVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return updatedVendor;
};

//! Delete vendor by ID
const deleteVendorService = async (vendorId: string) => {
  const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
  if (!deletedVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return { message: "Vendor deleted successfully" };
};

//! Get customers by vendor
const getVendorCustomersService = async (params: any, options: any) => {
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

//! Get Vendor Dashboard Meta
const getVendorDashboardMetaService = async (userId: string) => {
  // Fetch Vendor by userId
  const myVendor = await Vendor.findOne({ userId });
  if (!myVendor) throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");

  // Fetch all orders for the vendor
  const allOrders = await SubOrder.find({ vendorId: myVendor._id });

  // Fetch all products for the vendor
  const allProducts = await Product.find({ supplier: myVendor._id });

  // Calculate sales & stats dynamically
  const totalSales = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = allOrders.filter(
    (order) => order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING
  ).length;
  const completedOrders = allOrders.filter((order) => order.status === OrderStatus.DELIVERED).length;
  const cancelledOrders = allOrders.filter((order) => order.status === OrderStatus.CANCELLED).length;
  const lowStockProducts = allProducts.filter((product) => product.stock <= 10).length;

  // Function to generate sales data and customer growth
  const { monthly, weekly, daily, monthlyDaysSales, uniqueCustomerGrowth } = generateSalesData(allOrders);

  // Collect the most recent reviews from all products
  const recentReviews = allProducts
    .flatMap((product) => product.reviews)
    .filter((review) => review?.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Return data in the desired format
  return {
    meta: {
      overview: {
        totalSales,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        lowStockProducts,
        monthlyEarnings: totalSales * 0.2,
      },
      salesData: {
        monthly,
        weekly,
        daily,
        monthlyDaysSales,
      },
      recentOrders: allOrders.reverse(),
      products: allProducts,
      reviews: recentReviews,
      customerGrowth: uniqueCustomerGrowth,
    },
  };
};

export const VendorsServices = {
  createVendorService,
  getAllVendorsService,
  getVendorByUserIdService,
  getVendorByNameService,
  updateVendorService,
  deleteVendorService,
  getVendorCustomersService,
  getVendorDashboardMetaService,
};
