import cookie from "@fastify/cookie";
import fastify from "fastify";
import { env } from "./env";
import { mealsRoutes } from "./routes/meals.routes";

const app = fastify();

const PORT = env.PORT;

app.register(cookie);
app.register(mealsRoutes, { prefix: "/meals" });

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
