import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";
import { AppError } from "../../util/app.error.js";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof QueryFailedError) {
    const driverError = err.driverError;

    if (driverError?.code === "SQLITE_CONSTRAINT") {
      if (driverError.message?.includes("UNIQUE constraint failed")) {
        let message = "Conflict: This record already exists.";

        if (driverError.message.includes("users.email")) {
          message = "This 'email' is already registered.";
        } else if (
          driverError.message.includes("places.country") ||
          driverError.message.includes("places.city")
        ) {
          message = "This 'country' and 'city' is already registered.";
        }

        return res.status(409).json({ message });
      }
    }
  }

  return res.status(500).json({
    message: "Internal Server Error.",
  });
}
