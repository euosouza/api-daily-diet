import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

import z from "zod";
import { knex } from "../database";
import { checkSessionId } from "../middlewares/check-session-id.middleware";

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [checkSessionId] }, async (request, reply) => {
    const meals = await knex("meals").select("*").where({ session_id: request.cookies.sessionId });

    reply.status(200).send({ meals });
  });

  app.post("/", async (request, reply) => {
    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }

    const createSchemaValidation = z.object({
      name: z.string(),
      description: z.string(),
      date_time: z.string(),
      on_diet: z.boolean(),
    });

    const { name, description, date_time, on_diet } = createSchemaValidation.parse(request.body);

    await knex("meals").insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      description,
      date_time,
      on_diet,
    });

    reply.status(201).send();
  });

  app.get("/:id", { preHandler: [checkSessionId] }, async (request, reply) => {
    const getMealSchemaValidation = z.object({
      id: z.string(),
    });

    const { id } = getMealSchemaValidation.parse(request.params);

    const meal = await knex("meals").select("*").where({ id, session_id: request.cookies.sessionId }).first();

    if (!meal) {
      return reply.status(404).send({ error: "Refeição não encontrada" });
    }

    reply.status(200).send({ meal });
  });

  app.put("/:id", async (request, reply) => {
    const updateSchemaValidation = z.object({
      id: z.string(),
    });

    const { id } = updateSchemaValidation.parse(request.params);

    const updateBodySchemaValidation = z.object({
      name: z.string(),
      description: z.string(),
      date_time: z.string(),
      on_diet: z.boolean(),
    });

    const { name, description, date_time, on_diet } = updateBodySchemaValidation.parse(request.body);

    const meal = await knex("meals").select("*").where({ id, session_id: request.cookies.sessionId }).first();

    if (!meal) {
      return reply.status(404).send({ error: "Refeição não encontrada" });
    }

    await knex("meals").where({ id }).update({
      name,
      description,
      date_time,
      on_diet,
    });

    reply.status(200).send();
  });

  app.delete("/:id", async (request, reply) => {
    const deleteSchemaValidation = z.object({
      id: z.string(),
    });

    const { id } = deleteSchemaValidation.parse(request.params);

    const meal = await knex("meals").select("*").where({ id }).first();

    if (!meal) {
      return reply.status(404).send({ error: "Refeição não encontrada" });
    }

    await knex("meals").where({ id }).delete();

    reply.status(200).send();
  });

  app.get("/summary", { preHandler: [checkSessionId] }, async (request, reply) => {
    const meals = await knex("meals").select("*").where({ session_id: request.cookies.sessionId }).orderBy("date_time", "asc");

    const [{ totalMeals }] = (await knex("meals").where({ session_id: request.cookies.sessionId }).count("id as totalMeals")) as [
      { totalMeals: number },
    ];
    const [{ totalOnDiet }] = (await knex("meals").where({ session_id: request.cookies.sessionId, on_diet: true }).count("id as totalOnDiet")) as [
      { totalOnDiet: number },
    ];
    const [{ totalNotOnDiet }] = (await knex("meals")
      .where({ session_id: request.cookies.sessionId, on_diet: false })
      .count("id as totalNotOnDiet")) as [{ totalNotOnDiet: number }];

    // Calcula a melhor sequência consecutiva de refeições dentro da dieta
    let bestSequence = 0;
    let currentSequence = 0;

    for (const meal of meals) {
      if (meal.on_diet) {
        currentSequence++;
        bestSequence = Math.max(bestSequence, currentSequence);
      } else {
        currentSequence = 0;
      }
    }

    const summary = {
      totalMeals,
      totalOnDiet,
      totalNotOnDiet,
      bestSequence,
    };

    reply.status(200).send({ summary });
  });
}
