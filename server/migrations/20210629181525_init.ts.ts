import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    let hasTable = await knex.schema.hasTable('handbrakedata');
    if(!hasTable){
        await knex.schema.createTable('handbrakedata', (table)=>{
            table.increments();
            
            table.timestamps(false,true);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
}

