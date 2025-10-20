import swaggerJsdoc from "swagger-jsdoc";
import { config } from "../config/config.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API de Lugares (Places API)",
      version: "1.0.0",
      description: "Documentação da API de Lugares",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Servidor de Desenvolvimento",
      },
    ],
    components: {
      schemas: {
        Place: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            country: { type: "string", example: "Brasil" },
            city: { type: "string", example: "Jaguariúna" },
            goal: {
              type: "string",
              format: "date",
              example: "2026-05-01",
            },
            imageUrl: {
              type: "string",
              format: "uri",
              nullable: true,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PlaceInput: {
          type: "object",
          required: ["country", "city", "goal"],
          properties: {
            country: { type: "string", example: "Brasil" },
            city: { type: "string", example: "Jaguariúna" },
            goal: {
              type: "string",
              format: "YYYY-MM",
              description: "Meta (Mês e Ano) no formato YYYY-MM.",
              example: "2026-05",
            },
            imageUrl: {
              type: "string",
              format: "uri",
              nullable: true,
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/places/place.routes.ts"],
};

export const specs = swaggerJsdoc(options);
