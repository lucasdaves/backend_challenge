import { Request, Response, NextFunction } from "express";
import { DataSource } from "typeorm";
import { AuthService } from "./auth.service.js";

export class AuthController {
  private service: AuthService;

  constructor(dataSource: DataSource) {
    this.service = new AuthService(dataSource);
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "Bad Request: 'email' and 'password' is required.",
        });
      }

      const user = await this.service.register({ email, password });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "Bad Request: 'email' and 'password' is required.",
        });
      }

      const token = await this.service.login(email, password);

      if (!token) {
        return res.status(401).json({ message: "Email ou senha inválidos." });
      }

      res.json({ message: "You have logged in successfully.", token });
    } catch (error) {
      next(error);
    }
  };
}
