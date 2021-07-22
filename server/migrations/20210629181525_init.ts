import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('companies', (table) => {
    table.increments();
    table.string('company_name').notNullable();
    table.string('tel').notNullable();
    table.string('contact_person');
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable('vehicles', (table) => {
    table.increments();
    table.string('car_plate', 8).notNullable();
    table.string('vehicle_model');
    table.string('vehicle_type');
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable('devices', (table) => {
    table.increments();
    table.string('device_name', 20).notNullable();
    table.string('device_eui', 30).notNullable();
    table.string('version').notNullable().defaultTo('0.0.0');
    table.boolean('is_register').defaultTo(false).notNullable();
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable('alert_data', (table) => {
    table.increments();
    table.integer('device_id').notNullable().unsigned();
    table.foreign('device_id').references('devices.id');
    // table.date('date').notNullable(); // data detail
    // table.time('time').notNullable(); // data detail
    table.dateTime('date');
    table.specificType('geolocation','POINT').notNullable().comment('latitude and longitude');
    table.string('address').notNullable().comment('fetch geolocation and return address');
    table.string('msg_type').notNullable().comment('A for alert, B for battery');
    table.string('battery', 20).notNullable(); // data detail
    table.string('data', 100).notNullable(); // encoding data, need to decode, detail is above 5 types
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable('company_vehicles', (table) => {
    table.increments();
    table.integer('company_id').notNullable().unsigned();
    table.foreign('company_id').references('companies.id');
    table.integer('vehicle_id').notNullable().unsigned();
    table.foreign('vehicle_id').references('vehicles.id');
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });
  await knex.schema.createTable('vehicle_device', (table) => {
    table.increments();
    table.integer('vehicle_id').notNullable().unsigned();
    table.foreign('vehicle_id').references('vehicles.id');
    table.integer('device_id').notNullable().unsigned();
    table.foreign('device_id').references('devices.id');
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('vehicle_device');
  await knex.schema.dropTable('company_vehicles');
  await knex.schema.dropTable('alert_data');
  await knex.schema.dropTable('devices');
  await knex.schema.dropTable('vehicles');
  await knex.schema.dropTable('companies');
}
