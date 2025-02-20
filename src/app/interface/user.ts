import { Document, Types } from "mongoose";

export interface TUser extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: "customer" | "vendor";
  isEmailVerified: boolean;
  profile: TProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  region: string;
  city: string;
  area: string;
  fullAddress: string;
}

export interface TProfile extends Document {
  userId: Types.ObjectId;
  address: Address[];
  photo: string;
  orders: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
