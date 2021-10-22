import { Knex } from 'knex';

const usersTable = 'users';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table(usersTable, (table) => {
    table.string('email').nullable().alter();
    table.string('username').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(usersTable, (table) => {
    table.string('username').nullable().alter();
    table.string('email').notNullable().alter();
  });
}
