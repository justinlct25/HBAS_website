import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    let hasTable = await knex.schema.hasTable('companies');
    if(!hasTable){
        await knex.schema.createTable('companies', (table)=>{
            table.increments();
            table.string('company_name').notNullable().unique();
            table.string('tel').notNullable();
            table.string('contact_person')
            table.boolean('is_active').defaultTo(true).notNullable();
            table.timestamps(false, true);
        });
    }
    hasTable = await knex.schema.hasTable('vehicles');
    if(!hasTable){
        await knex.schema.createTable('vehicles', (table)=>{
            table.increments();
            table.string('car_plate',8).notNullable().unique();
            table.string('vehicle_model')
            table.string('vehicle_type')
            table.boolean('is_active').defaultTo(true).notNullable();
            table.timestamps(false, true);
        });
    }
    hasTable = await knex.schema.hasTable('devices');
    if(!hasTable){
        await knex.schema.createTable('devices', (table)=>{
            table.increments();
            table.string('device_name', 20).notNullable();
            table.string('device_eui', 30).notNullable();
            table.boolean('is_active').defaultTo(true).notNullable();
            table.timestamps(false, true);
        });
    }
    hasTable = await knex.schema.hasTable('alert_data');
    if(!hasTable){
        await knex.schema.createTable('alert_data', (table)=>{
            table.increments();
            table.integer('device_id').notNullable();
            table.foreign('device_id').references('devices.id');
            table.date('date').notNullable();// data detail
            table.time('time').notNullable();// data detail
            table.string('latitude', 20).notNullable();// data detail
            table.string('longitude', 20).notNullable();// data detail
            table.string('battery', 20).notNullable();// data detail
            table.string('data', 100).notNullable();// encoding data, need to decode, detail is above 5 types
            table.boolean('is_active').defaultTo(true).notNullable();
            table.timestamps(false,true);
        });
    }
    hasTable = await knex.schema.hasTable('company_vehicles');
    if(!hasTable){
        await knex.schema.createTable('company_vehicles', (table)=>{
            table.increments();
            table.integer('company_id').notNullable();
            table.foreign('company_id').references('companies.id');
            table.integer('vehicle_id').notNullable();
            table.foreign('vehicle_id').references('vehicles.id');
            table.boolean('is_active').defaultTo(true).notNullable();
            table.timestamps(false, true);
        });
    }
    hasTable = await knex.schema.hasTable('vehicle_device');
    if(!hasTable){
        await knex.schema.createTable('vehicle_device', (table)=>{
            table.increments();
            table.integer('vehicle_id').notNullable();
            table.foreign('vehicle_id').references('vehicles.id');
            table.integer('device_id').notNullable();
            table.foreign('device_id').references('devices.id');
            table.boolean('is_active').defaultTo(true).notNullable();
            table.timestamps(false, true);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('vehicle_device');
    await knex.schema.dropTable('company_vehicles');
    await knex.schema.dropTable('alert_data');
    await knex.schema.dropTable('devices');
    await knex.schema.dropTable('vehicles');
    await knex.schema.dropTable('companies');
}

