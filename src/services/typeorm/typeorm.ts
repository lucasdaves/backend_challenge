import "reflect-metadata";
import { DataSource } from "typeorm";
import { Place } from "../../modules/places/place.entity.js";
import { config } from "../../config/config.js";
import { User } from "../../modules/users/user.entity.js";

const isTestEnv = process.env.NODE_ENV === "test";
const isDevEnv = process.env.NODE_ENV === "development";

export const dataSource = new DataSource({
  type: config.dbType as any,
  database: isTestEnv ? ":memory:" : `${config.dbSrc}${config.dbName}`,
  entities: [User, Place],
  synchronize: isTestEnv || isDevEnv,
  logging: false,
  migrations: [],
  subscribers: [],
});
