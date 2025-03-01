import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  next_public_base_url: process.env.NEXT_PUBLIC_BASE_URL,

  jwt: {
    jwt_bcrypt_salt_rounds: process.env.JWT_BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  strip_secret_key: process.env.STRIP_SECRET_KEY,

  sslcommerz: {
    store_id: process.env.your_store_id,
    store_pass: process.env.your_store_pass,
  },
};
