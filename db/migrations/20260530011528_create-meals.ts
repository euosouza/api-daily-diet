import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary();
    table.uuid("session_id").notNullable().index();
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.dateTime("date_time").notNullable();
    table.boolean("on_diet").notNullable().defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("meals");
}
