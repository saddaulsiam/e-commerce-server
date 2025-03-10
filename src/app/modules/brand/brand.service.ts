import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBrand } from "./brand.interface";
import Brand from "../../Schema/Brand";

//! Create a new brand
export const createBrandService = async (brandData: TBrand) => {
  // Check if brand already exists
  const existingBrand = await Brand.findOne({ name: brandData.name });
  if (existingBrand) {
    throw new AppError(httpStatus.BAD_REQUEST, "Brand already exists");
  }

  //! Create new brand
  const newBrand = await Brand.create(brandData);

  return newBrand;
};

//! Get all brands
export const getBrandsService = async () => {
  const brands = await Brand.find();
  return brands;
};

//! Get brand by ID
export const getBrandByIdService = async (brandId: string) => {
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }
  return brand;
};

//! Update brand by ID
export const updateBrandService = async (brandId: string, updateData: Partial<TBrand>) => {
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }

  // Update the brand with provided data
  const updatedBrand = await Brand.findByIdAndUpdate(brandId, updateData, { new: true });
  return updatedBrand;
};

//! Delete brand by ID
export const deleteBrandService = async (brandId: string) => {
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }

  // Delete the brand
  await Brand.findByIdAndDelete(brandId);
  return { message: "Brand deleted successfully" };
};

export const BrandServices = {
  createBrandService,
  getBrandsService,
  getBrandByIdService,
  updateBrandService,
  deleteBrandService,
};
