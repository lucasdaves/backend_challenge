import { DataSource } from "typeorm";
import { Place } from "./place.entity.js";
import { PlaceRepository } from "./place.repository.js";
import { AppError } from "../../util/app.error.js";

export class PlaceService {
  private repo: PlaceRepository;

  constructor(dataSource: DataSource) {
    this.repo = new PlaceRepository(dataSource);
  }

  list(): Promise<Place[]> {
    return this.repo.findAll();
  }

  get(id: string): Promise<Place | null> {
    return this.repo.findById(id);
  }

  async create(data: Partial<Place>): Promise<Place> {
    try {
      return await this.repo.create(data);
    } catch (error: any) {
      if (
        error.code === "SQLITE_CONSTRAINT" &&
        error.message.includes("UNIQUE constraint failed")
      ) {
        throw new AppError(
          "This 'country' and 'city' is already registered.",
          409
        );
      }
      throw error;
    }
  }

  update(id: string, data: Partial<Place>) {
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
