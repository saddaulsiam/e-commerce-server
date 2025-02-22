import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VendorsServices } from "./vendor.service";

// Create Vendor
const createVendor = catchAsync(async (req, res) => {
  const vendorData = req.body;
  const result = await VendorsServices.createVendorService(vendorData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Vendor created successfully!",
    data: result,
  });
});

// Get all vendors
const getAllVendors = catchAsync(async (req, res) => {
  const result = await VendorsServices.getAllVendorsService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendors retrieved successfully!",
    data: result,
  });
});

// Get vendor by ID
const getVendorById = catchAsync(async (req, res) => {
  const vendorId = req.params.id;
  const result = await VendorsServices.getVendorByIdService(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor retrieved successfully!",
    data: result,
  });
});

// Update vendor by ID
const updateVendor = catchAsync(async (req, res) => {
  const vendorId = req.params.id;
  const updateData = req.body;
  const result = await VendorsServices.updateVendorService(vendorId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor updated successfully!",
    data: result,
  });
});

// Delete vendor by ID
const deleteVendor = catchAsync(async (req, res) => {
  const vendorId = req.params.id;
  const result = await VendorsServices.deleteVendorService(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor deleted successfully!",
    data: result,
  });
});

// Get products by vendor
const getVendorProducts = catchAsync(async (req, res) => {
  const vendorId = req.params.id;
  const result = await VendorsServices.getVendorProductsService(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor products retrieved successfully!",
    data: result,
  });
});

export const VendorsController = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getVendorProducts,
};
