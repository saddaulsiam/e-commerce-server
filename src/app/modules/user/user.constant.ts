export const USER_ROLE = {
  superAdmin: "superAdmin",
  admin: "admin",
  customer: "customer",
  vendor: "vendor",
} as const;

export const UserStatus = ["in-progress", "blocked"];

export const userFilterableFields = ["role", "search", "status"];
export const orderSearchAbleFields = [];
