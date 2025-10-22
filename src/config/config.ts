import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbType: process.env.DB_TYPE || "sqlite",
  dbName: process.env.DB_NAME || "database.sqlite",
  dbSrc: process.env.DB_SRC || "./db/",
  jwt_secret: process.env.JWT_SECRET || "",
};
