import { DataSource, Repository } from "typeorm";
import { Place } from "./place.entity.js";

export class PlaceRepository {
  private repo: Repository<Place>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Place);
  }

  findAll() {
    return this.repo.find({
      order: {
        goal: "ASC",
      },
    });
  }

  findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Place>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<Place>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
