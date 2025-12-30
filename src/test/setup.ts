import { afterAll, beforeAll, beforeEach } from "vitest";
import { DataSource } from "typeorm";
import app from "../services/express/app.js";
import { dataSource } from "../services/typeorm/typeorm.js";

if (process.env.NODE_ENV !== "test") {
  throw new Error("Tests must be run with NODE_ENV=test");
}

process.env.NODE_ENV = "test";

export let testDataSource: DataSource;

beforeAll(async () => {
  if (!dataSource.isInitialized) {
    testDataSource = await dataSource.initialize();
  } else {
    testDataSource = dataSource;
  }
});

beforeEach(async () => {
  await testDataSource.synchronize(true);
});

afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
});

export { app };
