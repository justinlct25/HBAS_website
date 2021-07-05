import * as Knex from 'knex';

export class DataService {
    constructor(private knex:Knex){}

    async getAlertData(offset:number, limit:number):Promise<any>{
        return await this.knex.select("*").from("device").limit(limit).offset(offset);
    }

    async postAlertData(
        device_name:string, 
        dev_eui:string, 
        data:string, 
        date:string, 
        time:string, 
        latitude:string, 
        longitude:string, 
        battery:string){
        return await this.knex('device').insert({
            device_name, dev_eui, data, date, time, latitude, longitude, battery
        }).returning('id');
    }
    
    async putAlertData(){
        return;
    }

    async deleteAlertData(){
        return;
    }
}