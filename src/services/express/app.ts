import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import { loggerMiddleware } from "../middlewares/logger.middleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(routes);
app.use(errorMiddleware);

export default app;
