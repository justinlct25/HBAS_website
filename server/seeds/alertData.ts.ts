import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("device").del();

    // Inserts seed entries
    await knex("device").insert([
        { id: 1, device_name: "ramp_meter_000", dev_eui: "RzrIaAAqADc=", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw", date: "2020-06-03", time: "05:19:53", latitude: "22.123456", longitude: "114.12346", battery: "1.95" },
        { id: 2, device_name: "ramp_meter_000", dev_eui: "RzrIaAAqADc=", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw", date: "2020-06-04", time: "10:25:23", latitude: "22.432875", longitude: "114.69823", battery: "1.94" },
        { id: 3, device_name: "ramp_meter_000", dev_eui: "RzrIaAAqADc=", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw", date: "2020-06-14", time: "16:12:30", latitude: "22.638301", longitude: "114.37821", battery: "1.93" },
        
    ]);
};
