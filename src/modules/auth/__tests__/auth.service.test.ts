import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "../auth.service.js";
import { testDataSource } from "../../../test/setup.js";
import bcrypt from "bcryptjs";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    authService = new AuthService(testDataSource);
    await testDataSource.getRepository("users").clear();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test1@example.com",
        password: "password123",
      };

      const result = await authService.register(userData);

      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result).not.toHaveProperty("password");
    });

    it("should throw error when email already exists", async () => {
      const userData = {
        email: "test2@example.com",
        password: "password123",
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow(
        "This 'email' is already registered."
      );
    });
  });

  describe("login", () => {
    it("should return token for valid credentials", async () => {
      const userData = {
        email: "test3@example.com",
        password: "password123",
      };

      await authService.register(userData);

      const token = await authService.login(userData.email, userData.password);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should return null for invalid credentials", async () => {
      const token = await authService.login("wrong@email.com", "wrongpass");
      expect(token).toBeNull();
    });

    it("should return null for valid email but wrong password", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      await authService.register(userData);

      const token = await authService.login(userData.email, "wrongpass");
      expect(token).toBeNull();
    });
  });
});
