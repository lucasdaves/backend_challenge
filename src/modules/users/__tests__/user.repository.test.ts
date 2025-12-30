import { describe, it, expect, beforeEach } from "vitest";
import { UserRepository } from "../user.repository.js";
import { testDataSource } from "../../../test/setup.js";
import bcrypt from "bcryptjs";
import { User } from "../user.entity.js";

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    userRepository = new UserRepository(testDataSource);
    await testDataSource.getRepository(User).clear();
  });

  describe("create", () => {
    it("should create a user and hash the password", async () => {
      const userData: Partial<User> = {
        email: "test@example.com",
        password: "password123",
      };

      const created = await userRepository.create(userData);

      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.email).toBe(userData.email);
      expect(created.password).not.toBe(userData.password);
      expect(await bcrypt.compare(userData.password!, created.password)).toBe(
        true
      );
    });

    it("should throw error when email already exists", async () => {
      const userData: Partial<User> = {
        email: "test@example.com",
        password: "password123",
      };

      await userRepository.create(userData);

      await expect(userRepository.create(userData)).rejects.toThrow();
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      const userData: Partial<User> = {
        email: "test10@example.com",
        password: "password123",
      };

      await userRepository.create(userData);

      const found = await userRepository.findByEmail(userData.email!);
      expect(found).toBeDefined();
      expect(found?.email).toBe(userData.email);
    });

    it("should return null for non-existent email", async () => {
      const found = await userRepository.findByEmail("nonexistent@example.com");
      expect(found).toBeNull();
    });
  });
});
