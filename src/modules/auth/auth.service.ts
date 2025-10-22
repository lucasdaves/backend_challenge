import { DataSource } from "typeorm";
import { UserRepository } from "../users/user.repository.js";
import { User } from "../users/user.entity.js";
import { config } from "../../config/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../util/app.error.js";

export class AuthService {
  private userRepo: UserRepository;

  constructor(dataSource: DataSource) {
    this.userRepo = new UserRepository(dataSource);
  }

  async register(data: Partial<User>): Promise<Omit<User, "password">> {
    const existingEntity = await this.userRepo.findByEmail(data.email!);

    if (existingEntity) {
      throw new AppError("This 'email' is already registered.", 409);
    }

    const user = await this.userRepo.create(data);

    const { password, ...userWithoutPassword } = user as any;

    return userWithoutPassword as Omit<User, "password">;
  }

  async login(email: string, pass: string): Promise<string | null> {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      return null;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwt_secret as string,
      { expiresIn: "1d" }
    );

    return token;
  }
}
