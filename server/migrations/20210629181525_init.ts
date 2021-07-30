import { Knex } from 'knex';

const companiesTable = 'companies';
const vehiclesTable = 'vehicles';
const devicesTable = 'devices';
const alertDataTable = 'alert_data';
const companyVehiclesTable = 'company_vehicles';
const vehicleDeviceTable = 'vehicle_device';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(companiesTable, (table) => {
    table.increments();
    table.string('company_name').notNullable();
    table.string('tel').notNullable();
    table.string('contact_person');
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(vehiclesTable, (table) => {
    table.increments();
    table.string('car_plate', 8).notNullable();
    table.string('vehicle_model');
    table.string('vehicle_type');
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(devicesTable, (table) => {
    table.increments();
    table.string('device_name').notNullable();
    table.string('device_eui').notNullable();
    table.string('version').notNullable().defaultTo('0.0.0');
    table.boolean('is_register').defaultTo(false).notNullable();
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(alertDataTable, (table) => {
    table.increments();
    table.integer('device_id').notNullable().unsigned();
    table.foreign('device_id').references(`${devicesTable}.id`);
    table.dateTime('date');
    table.specificType('geolocation', 'POINT').notNullable().comment('latitude and longitude');
    table.string('address').notNullable().comment('fetch geolocation and return address');
    table.string('msg_type').notNullable().comment('A for alert, B for battery');
    table.string('battery', 20).notNullable(); // data detail
    table.string('data').notNullable(); // encoding data, need to decode, detail is above 5 types
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(companyVehiclesTable, (table) => {
    table.increments();
    table.integer('company_id').notNullable().unsigned();
    table.foreign('company_id').references(`${companiesTable}.id`);
    table.integer('vehicle_id').notNullable().unsigned();
    table.foreign('vehicle_id').references(`${vehiclesTable}.id`);
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(vehicleDeviceTable, (table) => {
    table.increments();
    table.integer('vehicle_id').notNullable().unsigned();
    table.foreign('vehicle_id').references(`${vehiclesTable}.id`);
    table.integer('device_id').notNullable().unsigned();
    table.foreign('device_id').references(`${devicesTable}.id`);
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(vehicleDeviceTable);
  await knex.schema.dropTable(companyVehiclesTable);
  await knex.schema.dropTable(alertDataTable);
  await knex.schema.dropTable(devicesTable);
  await knex.schema.dropTable(vehiclesTable);
  await knex.schema.dropTable(companiesTable);
}
