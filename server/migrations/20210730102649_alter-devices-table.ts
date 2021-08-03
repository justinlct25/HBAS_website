import { Knex } from 'knex';

const devicesTable = 'devices';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table(devicesTable, (table) => {
    table.dropColumn('is_register');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(devicesTable, (table) => {
    table.boolean('is_register').defaultTo(false).notNullable();
  });
}
