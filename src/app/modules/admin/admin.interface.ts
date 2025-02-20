
export interface TAdmin {
  displayName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
  isEmailVerified: boolean;
  profile?: TProfile;
  createdAt: Date;
  updatedAt: Date;
}
