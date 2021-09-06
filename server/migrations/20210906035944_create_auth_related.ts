import { Knex } from 'knex';

const usersTable = 'users';
const devicesTable = 'devices';
const userDevices = 'user_devices';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(usersTable, (table) => {
    table.increments();
    table.string('username');
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('role').notNullable().defaultTo('USER');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(false, true);
  });

  await knex.schema.createTable(userDevices, (table) => {
    table.increments();
    table.integer('user_id').notNullable().unsigned();
    table.foreign('user_id').references(`${usersTable}.id`);
    table.integer('device_id').notNullable().unsigned();
    table.foreign('device_id').references(`${devicesTable}.id`);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(userDevices);
  await knex.schema.dropTable(usersTable);
}
