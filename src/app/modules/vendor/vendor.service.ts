import ApiError from "../../errors/ApiError";
import Vendor from "../../Schema/Vendor";
import Product from "../../Schema/Product";
import httpStatus from "http-status";

// Create Vendor
export const createVendorService = async (vendorData: any) => {
  const { userId, storeName, storeDescription, storeLogo, storeBanner, address } = vendorData;

  // Check if vendor already exists
  const existingVendor = await Vendor.findOne({ userId });
  if (existingVendor) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vendor already exists");
  }

  // Create new vendor
  const newVendor = await Vendor.create({
    userId,
    storeName,
    storeDescription,
    storeLogo,
    storeBanner,
    address,
    earnings: 0,
  });

  return newVendor;
};

// Get all vendors
export const getAllVendorsService = async () => {
  const vendors = await Vendor.find();
  return vendors;
};

// Get vendor by ID
export const getVendorByIdService = async (vendorId: string) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return vendor;
};

// Update vendor by ID
export const updateVendorService = async (vendorId: string, updateData: any) => {
  const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true });
  if (!updatedVendor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return updatedVendor;
};

// Delete vendor by ID
export const deleteVendorService = async (vendorId: string) => {
  const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
  if (!deletedVendor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return { message: "Vendor deleted successfully" };
};

// Get products by vendor
export const getVendorProductsService = async (vendorId: string) => {
  const products = await Product.find({ vendorId });
  return products;
};

export const VendorsServices = {
  createVendorService,
  getAllVendorsService,
  getVendorByIdService,
  updateVendorService,
  deleteVendorService,
  getVendorProductsService,
};
