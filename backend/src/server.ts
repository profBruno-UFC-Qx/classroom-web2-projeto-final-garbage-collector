import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env"; 
import { startCronJobs } from "./tasks/cron";
import { seedDatabase } from "./config/seed";

AppDataSource.initialize()
  .then(async () => { 
    console.log("Banco de dados inicializado com sucesso.");

    await seedDatabase();

    startCronJobs();

    app.listen(env.PORT, () => {
      console.log(`Servidor rodando em http://localhost:${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro na inicialização do banco de dados:", err);
  });