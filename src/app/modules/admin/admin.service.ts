import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Admin from "../../Schema/Admin";
import { TAdmin } from "./admin.interface";
import { jwtHelpers } from "../../utils/jwtHelpers";
import config from "../../config";

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
    config.jwt_access_secret!,
    config.jwt_access_expires_in!
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

  return { message: "Admin deleted successfully" };
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
};
