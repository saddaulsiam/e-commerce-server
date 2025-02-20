import { Types } from "mongoose";
import { TBrand } from "./brand";
import { TCategory } from "./category";

export type TProduct = {
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
};
