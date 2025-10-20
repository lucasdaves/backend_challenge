import "reflect-metadata";
import { DataSource } from "typeorm";
import { Place } from "../../modules/places/place.entity.js";
import { config } from "../../config/config.js";

export const dataSource = new DataSource({
  type: config.dbType as any,
  database: `${config.dbSrc}${config.dbName}` as string,
  entities: [Place],
  synchronize: config.nodeEnv === "development" ? true : false,
  logging: false,
  migrations: [],
  subscribers: [],
});
