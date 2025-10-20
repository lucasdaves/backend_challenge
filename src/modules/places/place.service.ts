import { DataSource } from "typeorm";
import { Place } from "./place.entity.js";
import { PlaceRepository } from "./place.repository.js";

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

  create(data: Partial<Place>): Promise<Place> {
    return this.repo.create(data);
  }

  update(id: string, data: Partial<Place>) {
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
