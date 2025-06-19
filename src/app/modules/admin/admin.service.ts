import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import Admin from "../../Schema/Admin";
import Product from "../../Schema/Product";
import SubOrder from "../../Schema/SubOrder";
import User from "../../Schema/User";
import Vendor from "../../Schema/Vendor";
import { VisitorLog } from "../../Schema/VisitorLog";
import { generateSalesData } from "../../utils/generateSalesData";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { OrderStatus } from "../order/order.interface";
import { TAdmin } from "./admin.interface";

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
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [vendors, orders, products, customers, visitors] = await Promise.all([
    Vendor.find({}),
    SubOrder.find({}),
    Product.find({}),
    User.find({ role: "customer" }).populate("profile"),
    VisitorLog.find({}),
  ]);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  let totalRevenue = 0;
  let weeklyRevenue = 0;
  let monthlyRevenue = 0;
  let yearlyRevenue = 0;

  const monthlyRevenueMap: Record<number, number> = {};
  const yearlyRevenueMap: Record<number, number> = {};

  const orderStats = {
    pending: 0,
    completed: 0,
    cancelled: 0,
  };

  const vendorRevenue: Record<string, number> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const amount = order.totalAmount;
    const month = date.getMonth();
    const year = date.getFullYear();
    const vendorId = order.vendorId?.toString();

    totalRevenue += amount;
    if (date >= startOfWeek) weeklyRevenue += amount;
    if (date >= startOfMonth) monthlyRevenue += amount;
    if (date >= startOfYear) yearlyRevenue += amount;

    monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + amount;
    yearlyRevenueMap[year] = (yearlyRevenueMap[year] || 0) + amount;

    if (vendorId) {
      vendorRevenue[vendorId] = (vendorRevenue[vendorId] || 0) + amount;
    }

    if (order.status === OrderStatus.DELIVERED) orderStats.completed++;
    else if (order.status === OrderStatus.CANCELLED) orderStats.cancelled++;
    else if ([OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.SHIPPED].includes(order.status as OrderStatus)) {
      orderStats.pending++;
    }
  });

  const monthly = monthNames.map((month, index) => ({
    month,
    revenue: monthlyRevenueMap[index] || 0,
  }));

  // After building yearlyRevenueMap
  const currentYear = now.getFullYear();
  const last3Years = [currentYear - 2, currentYear - 1, currentYear];

  const yearly = last3Years.map((year) => ({
    year,
    revenue: yearlyRevenueMap[year] || 0,
  }));

  const lowStockProducts = products.filter((p) => p.stock <= 10).length;

  const salesStats = generateSalesData(orders);

  const topVendors = Object.entries(vendorRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([vendorId, revenue]) => {
      const vendor = vendors.find((v) => v._id.toString() === vendorId);
      return {
        name: vendor?.storeName || "Unknown",
        sales: revenue,
        products: vendor?.products.length || 0,
      };
    });

  // Customer Growth Data
  const monthlyCustomerGrowthMap: Record<number, number> = {};
  const yearlyCustomerGrowthMap: Record<number, number> = {};

  customers.forEach((customer) => {
    const date = new Date(customer.createdAt);
    const month = date.getMonth();
    const year = date.getFullYear();

    // Monthly map only for current year
    if (year === currentYear) {
      monthlyCustomerGrowthMap[month] = (monthlyCustomerGrowthMap[month] || 0) + 1;
    }

    // Yearly map
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
        totalVisitors: visitors.length,
        totalVendors: vendors.length,
        totalCustomers: customers.length,
        totalSales: totalRevenue,
        weeklyRevenue,
        monthlyRevenue,
        yearlyRevenue,
        pendingOrders: orderStats.pending,
        completedOrders: orderStats.completed,
        cancelledOrders: orderStats.cancelled,
        lowStockProducts,
        monthlyEarnings: totalRevenue * 0.2,
      },
      salesData: {
        ...salesStats,
      },
      revenueData: {
        monthly,
        yearly: last3Years.map((year) => ({
          year,
          revenue: yearlyRevenueMap[year] || 0,
        })),
      },
      customerGrowthData: {
        monthly: monthlyCustomerGrowth,
        yearly: yearlyCustomerGrowth,
      },
      recentOrders: orders.slice(-10).reverse(),
      recentVendors: vendors.slice(-5).reverse(),
      recentCustomers: customers.slice(-5).reverse(),
      topVendors,
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
