import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("roles").del();

    await knex("roles").insert([
        { id: 1, role: "admin" },
        { id: 2, role: "user" },
    ]);
};
