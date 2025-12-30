import { describe, it, expect, beforeEach } from "vitest";
import { AuthController } from "../auth.controller.js";
import { testDataSource, app } from "../../../test/setup.js";
import request from "supertest";

describe("AuthController", () => {
  let authController: AuthController;

  beforeEach(async () => {
    authController = new AuthController(testDataSource);
    await testDataSource.getRepository("users").clear();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "test5@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("email");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 400 when email is missing", async () => {
      const response = await request(app).post("/auth/register").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Bad Request: 'email' and 'password' is required."
      );
    });

    it("should return 400 when password is missing", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Bad Request: 'email' and 'password' is required."
      );
    });

    it("should return 409 when email already exists", async () => {
      const userData = {
        email: "test6@example.com",
        password: "password123",
      };

      await request(app).post("/auth/register").send(userData);

      const response = await request(app).post("/auth/register").send(userData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("This 'email' is already registered.");
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const userData = {
        email: "test7@example.com",
        password: "password123",
      };

      await request(app).post("/auth/register").send(userData);

      const response = await request(app).post("/auth/login").send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.message).toBe("You have logged in successfully.");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "wrong8@email.com",
        password: "wrongpass",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email ou senha inválidos.");
    });

    it("should return 400 when email is missing", async () => {
      const response = await request(app).post("/auth/login").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Bad Request: 'email' and 'password' is required."
      );
    });

    it("should return 400 when password is missing", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Bad Request: 'email' and 'password' is required."
      );
    });
  });
});
