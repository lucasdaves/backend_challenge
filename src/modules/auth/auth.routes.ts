import { Router, Request, Response, NextFunction } from "express";
import { DataSource } from "typeorm";
import { AuthController } from "./auth.controller.js";

export const authRoutes = (dataSource: DataSource) => {
  const router = Router();
  const controller = new AuthController(dataSource);

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     summary: "Registra um novo usuário"
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AuthInput'
   *     responses:
   *       '201':
   *         description: "Usuário registrado com sucesso"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       '400':
   *         description: "Requisição inválida (ex: email ou senha faltando)"
   *       '409':
   *         description: "Conflito (ex: email já cadastrado)"
   */
  router.post("/register", (req: Request, res: Response, next: NextFunction) =>
    controller.register(req, res, next)
  );

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: "Autentica um usuário e retorna um token JWT"
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AuthInput'
   *     responses:
   *       '200':
   *         description: "Login bem-sucedido"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       '401':
   *         description: "Não autorizado (email ou senha inválidos)"
   */
  router.post("/login", (req: Request, res: Response, next: NextFunction) =>
    controller.login(req, res, next)
  );

  return router;
};
