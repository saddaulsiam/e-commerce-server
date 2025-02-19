import jwt from "jsonwebtoken";

exports.generateToken = (userInfo: any) => {
  const payload = {
    id: userInfo._id,
    email: userInfo.email,
    role: userInfo.role,
    displayName: userInfo.displayName,
    emailVerified: userInfo.emailVerified,
    providerId: userInfo.providerId,
  };

  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET as string, {
    expiresIn: "7days",
  });
};
