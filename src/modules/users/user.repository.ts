import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity.js";

export class UserRepository {
  private repo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(User);
  }

  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  create(data: Partial<User>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
