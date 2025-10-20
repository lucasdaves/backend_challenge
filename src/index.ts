import { dataSource } from "./services/typeorm/typeorm.js";
import { config } from "./config/config.js";
import app from "./services/express/app.js";

async function main() {
  try {
    await dataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized");
      })
      .catch((err) => {
        throw new Error("Error during Data Source initialization:" + err);
      });

    app.listen(config.port, () => {
      console.log(`Servidor rodando em http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Erro na inicialização do servidor:", error);
  }
}

main();
