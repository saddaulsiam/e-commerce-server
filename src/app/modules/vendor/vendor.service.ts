import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import SubOrder from "../../Schema/SubOrder";
import User from "../../Schema/User";
import Vendor from "../../Schema/Vendor";
import { VisitorLog } from "../../Schema/VisitorLog";
import { calculatePagination } from "../../utils/paginationHelper";
import { USER_ROLE } from "../user/user.constant";
import { vendorSearchAbleFields } from "./vendor.constant";
import { TStatus, TVendor } from "./vendor.interface";
import Product from "../../Schema/Product";
import { generateSalesData } from "../../utils/generateSalesData";

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
      throw new AppError(httpStatus.BAD_REQUEST, "Vendor already exists, check your profile");
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

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `${error?.message || error}`, error);
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
  const vendor = await Vendor.findOne({ userId });
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
      region: data.region,
      city: data.city,
      area: data.area,
      street: data.street,
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

const changeVendorStatusService = async (vendorId: string, status: TStatus) => {
  // Validate vendorId
  if (!vendorId || !mongoose.isValidObjectId(vendorId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid vendor ID");
  }
  // Validate status
  const validStatuses: TStatus[] = [
    TStatus.ACTIVE,
    TStatus.INACTIVE,
    TStatus.BLOCK,
    TStatus.PENDING,
    TStatus.PROCESSING,
    TStatus.DELETED,
  ];
  if (!validStatuses.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status");
  }
  // Check if vendor exists
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  // Check if the status is already set
  if (vendor.status === status) {
    throw new AppError(httpStatus.BAD_REQUEST, `Vendor is already ${status}`);
  }
  // Update vendor status
  const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, { status: status }, { new: true });
  if (!updatedVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return updatedVendor;
};

//! Get Vendor Dashboard Meta
const getVendorDashboardMetaService = async (userId: string) => {
  const { id: vendorId } = await getVendorByUserIdService(userId);
  if (!vendorId) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  // Get current year for customer growth
  const currentYear = new Date().getFullYear();
  const last3Years = [currentYear - 2, currentYear - 1, currentYear];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Fetch everything in parallel
  const [orders, lowStock, pendingOrders, completedOrders, cancelledOrders, recentOrders, products, uniqueCustomerIds] =
    await Promise.all([
      SubOrder.find({ vendorId }).lean(),
      Product.countDocuments({ vendorId, stock: { $lt: 5 } }),
      SubOrder.countDocuments({ vendorId, status: { $in: ["pending", "processing"] } }),
      SubOrder.countDocuments({ vendorId, status: "completed" }),
      SubOrder.countDocuments({ vendorId, status: "cancelled" }),
      SubOrder.find({ vendorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderId totalAmount shippingAddress status createdAt")
        .lean(),
      Product.find({ supplier: vendorId }).select("reviews").lean(),
      SubOrder.distinct("userId", { vendorId }), // Unique user IDs who placed orders
    ]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const earnings = Number((totalRevenue * 0.9).toFixed(2));

  // Sales chart data
  const salesStats = generateSalesData(orders);

  // Extract and sort recent reviews
  const allReviews = products.flatMap((p) => p.reviews || []);
  const reviews = allReviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      photo: r.photo,
      rating: r.rating,
      message: r.message,
      createdAt: r.createdAt,
    }));

  // Get actual customer documents
  const customers = await User.find({ _id: { $in: uniqueCustomerIds }, role: "customer" });

  // Customer growth maps
  const monthlyCustomerGrowthMap: Record<number, number> = {};
  const yearlyCustomerGrowthMap: Record<number, number> = {};

  customers.forEach((customer) => {
    const date = new Date(customer.createdAt);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (year === currentYear) {
      monthlyCustomerGrowthMap[month] = (monthlyCustomerGrowthMap[month] || 0) + 1;
    }

    if (last3Years.includes(year)) {
      yearlyCustomerGrowthMap[year] = (yearlyCustomerGrowthMap[year] || 0) + 1;
    }
  });

  const monthlyCustomerGrowth = monthNames.map((month, index) => ({
    month,
    customers: monthlyCustomerGrowthMap[index] || 0,
  }));

  const yearlyCustomerGrowth = last3Years.map((year) => ({
    year,
    customers: yearlyCustomerGrowthMap[year] || 0,
  }));

  return {
    meta: {
      overview: {
        totalRevenue,
        earnings,
        lowStock,
        pendingOrders,
        completedOrders,
        cancelledOrders,
      },
      salesData: {
        ...salesStats,
      },
      recentOrders,
      reviews,
      customerGrowth: {
        monthly: monthlyCustomerGrowth,
        yearly: yearlyCustomerGrowth,
      },
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
  changeVendorStatusService,
};
