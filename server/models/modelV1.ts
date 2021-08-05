export interface getAlertData{
    id: number;
    device_name: string;
    device_eui: string;
    date: Date;
    geolocation: {x: number, y: number};
    battery: string;
    address: string;
    company_name: string;
    tel: string;
    contact_person: string;
    car_plate: string;
    vehicle_model: string;
    vehicle_type: string;
    msg_type: string;
}