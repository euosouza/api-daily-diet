import cookie from "@fastify/cookie";
import fastify from "fastify";
import { env } from "./env";

const app = fastify();

const PORT = env.PORT;

app.register(cookie);

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
