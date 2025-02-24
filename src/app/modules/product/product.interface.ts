import { Document, Types } from "mongoose";
import { TBrand } from "../brand/brand.interface";
import { TCategory } from "../category/category.interface";

export interface TProduct extends Document {
  vendorId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: TCategory;
  brand: TBrand;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
