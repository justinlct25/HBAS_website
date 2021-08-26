import { Knex } from 'knex';

const vehiclesTable = 'vehicles';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table(vehiclesTable, (table) => {
    table.string('manufacturer').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(vehiclesTable, (table) => {
    table.dropColumn('manufacturer');
  });
}
