import { describe, it, expect, beforeEach } from "vitest";
import { PlaceRepository } from "../place.repository.js";
import { testDataSource } from "../../../test/setup.js";
import { Place } from "../place.entity.js";

describe("PlaceRepository", () => {
  let placeRepository: PlaceRepository;

  beforeEach(async () => {
    placeRepository = new PlaceRepository(testDataSource);
    await testDataSource.getRepository(Place).clear();
  });

  describe("create and findById", () => {
    it("should create and find a place by id", async () => {
      const placeData: Partial<Place> = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01T00:00:00.000Z"),
        imageUrl: "http://example.com/image.jpg",
      };

      const created = await placeRepository.create(placeData);
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();

      const found = await placeRepository.findById(created.id);
      expect(found).toBeDefined();
      expect(found?.country).toBe(placeData.country);
      expect(found?.city).toBe(placeData.city);
      expect(found?.goal).toEqual(placeData.goal);
      expect(found?.imageUrl).toBe(placeData.imageUrl);
    });
  });

  describe("findAll", () => {
    it("should return all places ordered by goal", async () => {
      const places: Partial<Place>[] = [
        {
          country: "Brazil",
          city: "Rio",
          goal: new Date("2024-02-01T00:00:00.000Z"),
        },
        {
          country: "France",
          city: "Paris",
          goal: new Date("2024-01-01T00:00:00.000Z"),
        },
        {
          country: "Japan",
          city: "Tokyo",
          goal: new Date("2024-03-01T00:00:00.000Z"),
        },
      ];

      for (const place of places) {
        await placeRepository.create(place);
      }

      const allPlaces = await placeRepository.findAll();
      expect(allPlaces).toHaveLength(3);
      expect(allPlaces[0].goal).toEqual(new Date("2024-01-01"));
      expect(allPlaces[1].goal).toEqual(new Date("2024-02-01"));
      expect(allPlaces[2].goal).toEqual(new Date("2024-03-01"));
    });
  });

  describe("update", () => {
    it("should update a place", async () => {
      const placeData: Partial<Place> = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01"),
      };

      const created = await placeRepository.create(placeData);
      const updatedData: Partial<Place> = {
        imageUrl: "http://example.com/new-image.jpg",
      };

      const updated = await placeRepository.update(created.id, updatedData);
      expect(updated).toBeDefined();
      expect(updated?.imageUrl).toBe(updatedData.imageUrl);
    });
  });

  describe("delete", () => {
    it("should delete a place", async () => {
      const placeData: Partial<Place> = {
        country: "Brazil",
        city: "São Paulo",
        goal: new Date("2024-01-01"),
      };

      const created = await placeRepository.create(placeData);
      await placeRepository.delete(created.id);

      const found = await placeRepository.findById(created.id);
      expect(found).toBeNull();
    });
  });
});
