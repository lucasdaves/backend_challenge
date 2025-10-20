import { placeRoutes } from "../../../modules/places/place.routes.js";
import { dataSource } from "../../typeorm/typeorm.js";
import { specs } from "../../../config/swagger.js";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

router.use("/places", placeRoutes(dataSource));

router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

export default router;
