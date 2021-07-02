import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    let hasTable = await knex.schema.hasTable('device');
    if(!hasTable){
        await knex.schema.createTable('device', (table)=>{
            table.increments();
            table.string('device_name', 20).notNullable();
            table.string('dev_eui', 30).notNullable();// device auth. code
            table.string('data', 100).notNullable();// encoding data, need to decode, detail is under 5 types
            table.string('date', 20).notNullable();// data detail
            table.string('time', 20).notNullable();// data detail
            table.string('latitude', 20).notNullable();// data detail
            table.string('longitude', 20).notNullable();// data detail
            table.string('battery', 20).notNullable();// data detail
            table.timestamps(false,true);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropSchemaIfExists('device');
}

