import { TProfile } from "./user";

export interface TAdmin {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
  isEmailVerified: boolean;
  profile?: TProfile;
  createdAt: Date;
  updatedAt: Date;
}
