import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Admin from "../../Schema/Admin";
import { TAdmin } from "./admin.interface";
import { jwtHelpers } from "../../utils/jwtHelpers";
import config from "../../config";
import User from "../../Schema/User";
import Vendor from "../../Schema/Vendor";
import SubOrder from "../../Schema/SubOrder";
import Product from "../../Schema/Product";
import { OrderStatus } from "../order/order.interface";
import { generateSalesData } from "../../utils/generateSalesData";

//!  Register a new admin
export const registerAdminService = async (userData: TAdmin) => {
  const { displayName, email, phoneNumber, password, role } = userData;

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new admin
  const newAdmin = await Admin.create({
    displayName,
    email,
    phoneNumber,
    password: hashedPassword,
    role: role || "admin",
    isEmailVerified: false,
  });

  return newAdmin;
};

//!  Admin Login
export const loginAdminService = async (email: string, password: string) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Generate JWT Token
  const accessToken = jwtHelpers.generateToken(
    {
      _id: admin._id,
      role: admin.role,
      email: admin.email,
    },
    config.jwt.jwt_access_secret!,
    config.jwt.jwt_access_expires_in!
  );

  return { admin, accessToken };
};

//!  Get All Admins
export const getAllAdminsService = async () => {
  const admins = await Admin.find();
  return admins;
};

//! Get Admin by ID
export const getAdminByIdService = async (adminId: string) => {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  }
  return admin;
};

//! Get Admin by Email
export const getAdminByEmailService = async (email: string) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  }
  return admin;
};

//! Update Admin
export const updateAdminService = async (adminId: string, updateData: Partial<TAdmin>) => {
  const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });

  if (!updatedAdmin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  }

  return updatedAdmin;
};

//!  Delete Admin
export const deleteAdminService = async (adminId: string) => {
  const deletedAdmin = await Admin.findByIdAndDelete(adminId);

  if (!deletedAdmin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  }
};

//! Get Admin Dashboard Meta
const adminDashboardMetaService = async () => {
  // Fetch all vendors, orders, and products
  const allVendors = await Vendor.find({});
  const allOrders = await SubOrder.find({});
  const allProducts = await Product.find({});
  const allUsers = await User.find({ role: "customer" }); // Assuming user roles exist

  // Calculate platform-wide stats
  const totalSales = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = allOrders.filter(
    (order) => order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING
  ).length;
  const completedOrders = allOrders.filter((order) => order.status === OrderStatus.DELIVERED).length;
  const cancelledOrders = allOrders.filter((order) => order.status === OrderStatus.CANCELLED).length;
  const lowStockProducts = allProducts.filter((product) => product.stock <= 10).length;

  // Sales data & customer growth
  const { monthly, weekly, daily, monthlyDaysSales, uniqueCustomerGrowth } = generateSalesData(allOrders);

  // Most recent reviews
  const recentReviews = allProducts
    .flatMap((product) => product.reviews)
    .filter((review) => review?.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Most recent vendors
  const recentVendors = allVendors
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Most recent users (customers)
  const recentCustomers = allUsers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Return formatted data
  return {
    meta: {
      overview: {
        totalVendors: allVendors.length,
        totalCustomers: allUsers.length,
        totalSales,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        lowStockProducts,
        monthlyEarnings: totalSales * 0.2, // Assuming 20% commission
      },
      salesData: {
        monthly,
        weekly,
        daily,
        monthlyDaysSales,
      },
      recentOrders: allOrders.reverse().slice(0, 10),
      recentVendors,
      recentCustomers,
      products: allProducts,
      reviews: recentReviews,
      customerGrowth: uniqueCustomerGrowth,
    },
  };
};

//!  Exporting all services
export const AdminServices = {
  registerAdminService,
  loginAdminService,
  getAllAdminsService,
  getAdminByIdService,
  getAdminByEmailService,
  updateAdminService,
  deleteAdminService,
  adminDashboardMetaService,
};
