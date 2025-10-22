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
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
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
        AuthInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "senha123",
            },
          },
        },
        UserResponse: {
          type: "object",
          description: "Resposta do usuário (sem a senha)",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Login bem-sucedido!" },
            token: {
              type: "string",
              example: "eyJhbGciOiJI...",
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/modules/places/place.routes.ts",
    "./src/modules/auth/auth.routes.ts",
  ],
};

export const specs = swaggerJsdoc(options);
