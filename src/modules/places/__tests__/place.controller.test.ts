import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, testDataSource } from "../../../test/setup.js";
import { Place } from "../place.entity.js";
import { PlaceRepository } from "../place.repository.js";

describe("PlaceController", () => {
  let placeRepository: PlaceRepository;

  beforeEach(async () => {
    placeRepository = new PlaceRepository(testDataSource);
    await testDataSource.getRepository(Place).clear();
  });

  describe("GET /places", () => {
    it("should list all places", async () => {
      const placeData = {
        country: "Brazil",
        city: "São Paulo",
        goal: "2024-01",
      };

      await placeRepository.create({
        ...placeData,
        goal: new Date("2024-01-01T00:00:00.000Z"),
      });

      const response = await request(app).get("/places");
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].country).toBe(placeData.country);
    });
  });

  describe("GET /places/:id", () => {
    it("should get a place by id", async () => {
      const placeData = {
        country: "Brazil",
        city: "São Paulo",
        goal: "2024-01",
      };

      const created = await placeRepository.create({
        ...placeData,
        goal: new Date("2024-01-01T00:00:00.000Z"),
      });

      const response = await request(app).get(`/places/${created.id}`);
      expect(response.status).toBe(200);
      expect(response.body.country).toBe(placeData.country);
    });

    it("should return 404 for non-existent id", async () => {
      const response = await request(app).get("/places/non-existent-id");
      expect(response.status).toBe(404);
    });
  });

  describe("POST /places", () => {
    it("should create a place", async () => {
      const placeData = {
        country: "Brazil",
        city: "São Paulo",
        goal: "2024-01",
      };

      const response = await request(app).post("/places").send(placeData);

      expect(response.status).toBe(201);
      expect(response.body.country).toBe(placeData.country);
      expect(response.body.city).toBe(placeData.city);
      expect(response.body.goal).toBeDefined();
    });

    it("should return 400 when goal is not provided", async () => {
      const placeData = {
        country: "Brazil",
        city: "São Paulo",
      };

      const response = await request(app).post("/places").send(placeData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad Request: 'goal' is required.");
    });

    it("should return 400 when goal format is invalid", async () => {
      const placeData = {
        country: "Brazil",
        city: "São Paulo",
        goal: "invalid-date",
      };

      const response = await request(app).post("/places").send(placeData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Bad Request: 'goal' must be in YYYY-MM format."
      );
    });

    it("should return 409 when city and country combination already exists", async () => {
      const placeData = {
        country: "Brazil",
        city: "São Paulo",
        goal: "2024-01",
      };

      await request(app).post("/places").send(placeData);

      const response = await request(app).post("/places").send(placeData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "This 'country' and 'city' is already registered."
      );
    });
  });

  describe("PUT /places/:id", () => {
    it("should update a place", async () => {
      const placeData = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01T00:00:00.000Z"),
      };

      const created = await placeRepository.create(placeData);
      const updateData = {
        imageUrl: "http://example.com/image.jpg",
      };

      const response = await request(app)
        .put(`/places/${created.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.imageUrl).toBe(updateData.imageUrl);
    });
  });

  describe("DELETE /places/:id", () => {
    it("should delete a place", async () => {
      const placeData = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01T00:00:00.000Z"),
      };

      const created = await placeRepository.create(placeData);

      const response = await request(app).delete(`/places/${created.id}`);

      expect(response.status).toBe(204);

      const found = await placeRepository.findById(created.id);
      expect(found).toBeNull();
    });
  });
});
