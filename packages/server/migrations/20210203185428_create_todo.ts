import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todos', (table) => {
    table.increments('id');

    table.string('title', 255).notNullable();
    table.string('description', 1000).notNullable();

    table.boolean('done').notNullable().defaultTo(false);

    table.timestamps(true, true);

    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.index('user_id', 'user_ids_index');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('todos');
}
