import express from "express";
import routes from "./routes/routes.js";
import expressMiddleware from "../middlewares/express.middleware.js";
import { loggerMiddleware } from "../middlewares/logger.middleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";

const app = express();

app.use(expressMiddleware);
app.use(loggerMiddleware);
app.use(routes);
app.use(errorMiddleware);

export default app;
