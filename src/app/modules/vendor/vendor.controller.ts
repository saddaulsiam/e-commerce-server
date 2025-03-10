import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VendorsServices } from "./vendor.service";
import pick from "../../utils/pick";
import { vendorFilterableFields } from "./vendor.constant";

//! Create Vendor
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

//! Get all vendors
const getAllVendors = catchAsync(async (req, res) => {
  const result = await VendorsServices.getAllVendorsService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendors retrieved successfully!",
    data: result,
  });
});

//! Get vendor by UserId
const getVendorByUserId = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await VendorsServices.getVendorByUserIdService(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor retrieved successfully!",
    data: result,
  });
});

//! Update vendor by ID
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

//! Delete vendor by ID
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

//! Get all customers by vendor
const getVendorCustomers = catchAsync(async (req, res) => {
  const vendorId = req.params.id;

  const filters = pick(req.query, vendorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await VendorsServices.getVendorCustomersService({ vendorId, ...filters }, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor customers retrieved successfully!",
    data: result,
  });
});

export const VendorsController = {
  createVendor,
  getAllVendors,
  getVendorByUserId,
  updateVendor,
  deleteVendor,
  getVendorCustomers,
};
