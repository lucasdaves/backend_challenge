import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof QueryFailedError) {
    const driverError = err.driverError;

    if (driverError?.code === "SQLITE_CONSTRAINT") {
      if (driverError.message?.includes("UNIQUE constraint failed")) {
        const detail = driverError.message || "UNIQUE constraint failed";

        return res.status(409).json({
          message: "Conflito: O recurso já existe.",
          detail: detail,
        });
      }
    }
  }

  return res.status(500).json({
    message: "Internal Server Error.",
  });
}
