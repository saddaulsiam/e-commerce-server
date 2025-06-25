import { Document, Types } from "mongoose";
import { TProduct } from "../product/product.interface";
import { TAddress } from "../user/user.interface";

export interface TVendor extends Document {
  userId: Types.ObjectId;
  storeName: string;
  phoneNumber: string;
  storeDescription: string;
  storeLogo?: string;
  storeBanner?: string;
  address: TAddress;
  products: TProduct[];
  earnings: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum TStatus {
  INACTIVE = "inactive",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PROCESSING = "processing",
  VERIFIED = "verified",
  ACTIVE = "active",
  BLOCK = "block",
  DELETED = "deleted",
  INSTOCK = "in-stock",
  OUTOFSTOCK = "out-of-stock",  
  DISCONTINUED = "discontinued",
}
