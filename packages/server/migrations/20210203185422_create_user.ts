import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');

    table.string('email', 255).unique().notNullable();

    table.string('hashed_password', 255).notNullable();

    table.string('salt', 255).notNullable();

    table.timestamps(true, true);

    table
      .integer('role_id')
      .notNullable()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
