import { Knex } from 'knex';

const alertDataTable = 'alert_data';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table(alertDataTable, (table) => {
    table.integer('rssi');
    table.integer('snr');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(alertDataTable, (table) => {
    table.dropColumn('snr');
    table.dropColumn('rssi');
  });
}
