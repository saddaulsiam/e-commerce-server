import { Document, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser extends Document {
  displayName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: "customer" | "vendor";
  profile: TProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface TAddress {
  name?: string;
  email?: string;
  phoneNumber?: string;
  region: string;
  city: string;
  area: string;
  street: string;
}

export interface TProfile extends Document {
  userId: Types.ObjectId;
  address: TAddress[];
  photo: string;
  orders: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type TUserRole = keyof typeof USER_ROLE;
