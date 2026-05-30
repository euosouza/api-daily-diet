import fastify from "fastify";

const app = fastify();

const PORT = 3000;

app.get("/", () => {
  return "Bem-vindo à Daily Diet API";
});

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });