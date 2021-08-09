import { Knex } from 'knex';

const alertDataTable = 'alert_data';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table(alertDataTable, (table) => {
    table.boolean('is_read').defaultTo(false).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(alertDataTable, (table) => {
    table.dropColumn('is_read');
  });
}
