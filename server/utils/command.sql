-- get all data
select alert_data.id, devices.device_name, devices.device_eui, alert_data.date, 
alert_data.time, alert_data.latitude, alert_data.longitude, alert_data.battery, 
companies.company_name, companies.tel, companies.contact_person, 
vehicles.car_plate, vehicles.vehicle_model, vehicle_type
from alert_data 
left join devices on devices.id = alert_data.device_id 
left join vehicle_device on vehicle_device.device_id = devices.id
left join vehicles on vehicles.id = vehicle_device.vehicle_id
left join company_vehicles on company_vehicles.vehicle_id = vehicles.id
left join companies on companies.id = company_vehicles.company_id 
where companies.is_active = true and devices.is_active = true and 
alert_data.is_active = true and vehicles.is_active = true and 
company_vehicles.is_active = true and vehicle_device.is_active = true
order by alert_data.date desc;

-- get grouping date
select devices.device_name, alertdata.date, count(alertdata.date), users.name, users.phone, users.car_plate, 
from alertdata 
left join devices on devices.id = alertdata.devices_id 
left join users on users.id = devices.users_id 
where devices.device_name = 'ramp_meter_001' and users.is_active = true and devices.is_active = true and alertdata.is_active = true
group by alertdata.date, devices.device_name, users.name, users.phone, users.car_plate
order by date desc;