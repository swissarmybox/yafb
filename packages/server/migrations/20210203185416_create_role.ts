import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table) => {
    table.increments('id');

    table.string('role', 255).notNullable();

    table.timestamps(true, true);
  });

  await knex('roles').insert([{ role: 'admin' }, { role: 'user' }]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('roles');
}
