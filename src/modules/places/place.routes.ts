import { Router, Request, Response, NextFunction } from "express";
import { DataSource } from "typeorm";
import { PlaceController } from "./place.controller.js";
import { authMiddleware } from "../../services/middlewares/auth.middleware.js";

export const placeRoutes = (dataSource: DataSource) => {
  const router = Router();
  const controller = new PlaceController(dataSource);

  /**
   * @openapi
   * /places:
   *   get:
   *     summary: "Lista todos os lugares"
   *     tags:
   *       - Places
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: "Lista de lugares"
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Place'
   */
  router.get(
    "/",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) =>
      controller.list(req, res, next),
  );

  /**
   * @openapi
   * /places:
   *   post:
   *     summary: "Cria um novo lugar"
   *     tags:
   *       - Places
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PlaceInput'
   *     responses:
   *       '201':
   *         description: "Lugar criado com sucesso"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Place'
   *       '400':
   *         description: "Requisição inválida (ex: body vazio)"
   */
  router.post(
    "/",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) =>
      controller.create(req, res, next),
  );

  /**
   * @openapi
   * /places/{id}:
   *   get:
   *     summary: "Busca um lugar pelo ID"
   *     tags:
   *       - Places
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: "ID do lugar"
   *     responses:
   *       '200':
   *         description: "Detalhes do lugar"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Place'
   *       '404':
   *         description: "Lugar não encontrado"
   */
  router.get(
    "/:id",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) =>
      controller.get(req, res, next),
  );

  /**
   * @openapi
   * /places/{id}:
   *   put:
   *     summary: "Atualiza um lugar existente"
   *     tags:
   *       - Places
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: "ID do lugar"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PlaceInput'
   *     responses:
   *       '200':
   *         description: "Lugar atualizado"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Place'
   *       '404':
   *         description: "Lugar não encontrado"
   *       '400':
   *         description: "Requisição inválida"
   */
  router.put(
    "/:id",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) =>
      controller.update(req, res, next),
  );

  /**
   * @openapi
   * /places/{id}:
   *   delete:
   *     summary: "Remove um lugar"
   *     tags:
   *       - Places
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: "ID do lugar"
   *     responses:
   *       '204':
   *         description: "Removido com sucesso"
   *       '404':
   *         description: "Lugar não encontrado"
   */
  router.delete(
    "/:id",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) =>
      controller.remove(req, res, next),
  );

  return router;
};
