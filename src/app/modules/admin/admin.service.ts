import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { generateToken } from "../../../utils/token";
import ApiError from "../../errors/ApiError";
import { TAdmin } from "../../interface/admin";
import Admin from "../../Schema/Admin";

//!  Register a new admin
export const registerAdminService = async (userData: TAdmin) => {
  const { name, email, phoneNumber, password, role } = userData;

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new admin
  const newAdmin = await Admin.create({
    name,
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
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Generate JWT Token
  const token = generateToken({ id: admin._id, role: admin.role, email: admin.email });

  return { admin, token };
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
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  return admin;
};

//!  Update Admin
export const updateAdminService = async (adminId: string, updateData: Partial<TAdmin>) => {
  const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });

  if (!updatedAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  return updatedAdmin;
};

//!  Delete Admin
export const deleteAdminService = async (adminId: string) => {
  const deletedAdmin = await Admin.findByIdAndDelete(adminId);

  if (!deletedAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  return { message: "Admin deleted successfully" };
};

//!  Exporting all services
export const AdminServices = {
  registerAdminService,
  loginAdminService,
  getAllAdminsService,
  getAdminByIdService,
  updateAdminService,
  deleteAdminService,
};
