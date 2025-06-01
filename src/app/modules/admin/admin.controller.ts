import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const registerAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.registerAdminService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin registered successfully!",
    data: result,
  });
});

const loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await AdminServices.loginAdminService(email, password);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    data: result,
  });
});

const getAllAdmins = catchAsync(async (_req, res) => {
  const result = await AdminServices.getAllAdminsService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins retrieved successfully!",
    data: result,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const adminId = req.params.id;
  const result = await AdminServices.getAdminByIdService(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieved successfully!",
    data: result,
  });
});

const getAdminByEmail = catchAsync(async (req, res) => {
  const adminEmail = req.params.email;
  const result = await AdminServices.getAdminByEmailService(adminEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieved successfully!",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const adminId = req.params.id;
  const updateData = req.body;
  const result = await AdminServices.updateAdminService(adminId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin updated successfully!",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const adminId = req.params.id;
  const result = await AdminServices.deleteAdminService(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully!",
    data: result,
  });
});

const getAdminDashboardMeta = catchAsync(async (req, res) => {
  const result = await AdminServices.adminDashboardMetaService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully!",
    data: result,
  });
});

export const AdminsController = {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  getAdminByEmail,
  updateAdmin,
  deleteAdmin,
  getAdminDashboardMeta,
};
