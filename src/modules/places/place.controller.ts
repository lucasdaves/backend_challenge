import { Request, Response, NextFunction } from "express";
import { DataSource } from "typeorm";
import { PlaceService } from "./place.service.js";
import { Place } from "./place.entity.js";

export class PlaceController {
  private service: PlaceService;

  constructor(dataSource: DataSource) {
    this.service = new PlaceService(dataSource);
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.list();
      res.json(items);
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.get(req.params.id);
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (!data || Object.keys(data).length === 0) {
        return res
          .status(400)
          .json({ message: "Bad Request: Request body cannot be empty." });
      }

      if (!data.goal) {
        return res
          .status(400)
          .json({ message: "Bad Request: 'goal' is required." });
      }

      if (typeof data.goal !== "string" || !/^\d{4}-\d{2}$/.test(data.goal)) {
        return res
          .status(400)
          .json({ message: "Bad Request: 'goal' must be in YYYY-MM format." });
      }

      const dataForService: Partial<Place> = {
        country: data.country,
        city: data.city,
        imageUrl: data.imageUrl,
        goal: new Date(`${data.goal}-01T00:00:00Z`),
      };

      const created = await this.service.create(dataForService);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const id = req.params.id;

      if (!data || Object.keys(data).length === 0) {
        return res
          .status(400)
          .json({ message: "Bad Request: Request body cannot be empty." });
      }

      const updateData: Partial<Place> = {};

      if (data.city !== undefined) {
        updateData.city = data.city;
      }

      if (data.goal !== undefined) {
        if (typeof data.goal !== "string" || !/^\d{4}-\d{2}$/.test(data.goal)) {
          return res.status(400).json({
            message: "Bad Request: 'goal' must be in YYYY-MM format.",
          });
        }
        updateData.goal = new Date(`${data.goal}-01T00:00:00Z`);
      }

      if (data.imageUrl !== undefined) {
        updateData.imageUrl = data.imageUrl;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message:
            "Bad Request: Only 'city', 'goal', and 'imageUrl' are allowed for update.",
        });
      }

      const updated = await this.service.update(id, updateData);

      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
