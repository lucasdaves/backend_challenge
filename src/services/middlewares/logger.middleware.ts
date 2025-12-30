import { Request, Response, NextFunction } from "express";
import { config } from "../../config/config.js";

export const loggerMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  if (config.nodeEnv === "development") {
    res.on("finish", () => {
      const statusCode = res.statusCode;
      const message = res.statusMessage || "";

      console.log(
        `[${timestamp}] ${method} ${url} - ${statusCode} - ${message}`
      );
    });
  }

  next();
};
