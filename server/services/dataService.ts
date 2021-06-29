import * as Knex from 'knex';

export class DataService {
    constructor(private knex:Knex){}

    async getAlertData(){
        return await this.knex.select('*').from('handbrakedata');
    }

    async postAlertData(){
        return await this.knex('handbrakedata').insert({}).returning('id');
    }
    
    async putAlertData(){
        return;
    }

    async deleteAlertData(){
        return;
    }
}