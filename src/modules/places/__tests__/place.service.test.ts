import { describe, it, expect, beforeEach } from "vitest";
import { PlaceService } from "../place.service.js";
import { testDataSource } from "../../../test/setup.js";
import { Place } from "../place.entity.js";

describe("PlaceService", () => {
  let placeService: PlaceService;

  beforeEach(async () => {
    placeService = new PlaceService(testDataSource);
    await testDataSource.getRepository(Place).clear();
  });

  describe("create", () => {
    it("should create a place successfully", async () => {
      const placeData: Partial<Place> = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01"),
      };

      const created = await placeService.create(placeData);
      expect(created).toBeDefined();
      expect(created.country).toBe(placeData.country);
      expect(created.city).toBe(placeData.city);
      expect(created.goal).toEqual(placeData.goal);
    });

    it("should throw error when city and country combination already exists", async () => {
      const placeData: Partial<Place> = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01"),
      };

      await placeService.create(placeData);

      await expect(placeService.create(placeData)).rejects.toThrow(
        "This 'country' and 'city' is already registered."
      );
    });
  });

  describe("list", () => {
    it("should list all places", async () => {
      const places: Partial<Place>[] = [
        { country: "Brazil", city: "Rio", goal: new Date("2024-02-01") },
        { country: "France", city: "Paris", goal: new Date("2024-01-01") },
      ];

      for (const place of places) {
        await placeService.create(place);
      }

      const result = await placeService.list();
      expect(result).toHaveLength(2);
    });
  });

  describe("get", () => {
    it("should get a place by id", async () => {
      const placeData: Partial<Place> = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01"),
      };

      const created = await placeService.create(placeData);
      const found = await placeService.get(created.id);

      expect(found).toBeDefined();
      expect(found?.country).toBe(placeData.country);
    });

    it("should return null for non-existent id", async () => {
      const found = await placeService.get("non-existent-id");
      expect(found).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a place", async () => {
      const placeData: Partial<Place> = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01"),
      };

      const created = await placeService.create(placeData);
      const updateData: Partial<Place> = {
        imageUrl: "http://example.com/image.jpg",
      };

      const updated = await placeService.update(created.id, updateData);
      expect(updated).toBeDefined();
      expect(updated?.imageUrl).toBe(updateData.imageUrl);
    });
  });

  describe("remove", () => {
    it("should remove a place", async () => {
      const placeData: Partial<Place> = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01"),
      };

      const created = await placeService.create(placeData);
      await placeService.remove(created.id);

      const found = await placeService.get(created.id);
      expect(found).toBeNull();
    });
  });
});
