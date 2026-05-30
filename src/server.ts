import fastify from "fastify";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

const PORT = env.PORT;

app.get("/", async () => {
  const migrations = await knex("knex_migrations").select("*");
  return { migrations };
});

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
