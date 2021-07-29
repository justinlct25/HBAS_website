-- get all data
select alert_data.id, devices.device_name, devices.device_eui, alert_data.date, 
alert_data.time, alert_data.geolocation, alert_data.battery, 
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

-- get company & vehicles data and counting
select distinct(companies.id), companies.company_name, companies.tel, companies.contact_person, count(company_vehicles.company_id)
from companies left join company_vehicles on company_vehicles.company_id = companies.id
group by companies.id
    -- check string or numbers for search
having count(company_vehicles.company_id) = 1;
having company_name ilike '%a%';

-- get all alert data by searching
select alert_data.id, devices.device_name, devices.device_eui, alert_data.date, 
alert_data.time, alert_data.geolocation, alert_data.battery, 
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
company_vehicles.is_active = true and vehicle_device.is_active = true and devices.device_eui like '%aAA%'
order by alert_data.date desc;
-- get all devices data by searching
select devices.id, devices.device_name, devices.device_eui, vehicles.car_plate, vehicles.vehicle_model, 
vehicles.vehicle_type, companies.company_name, companies.tel, companies.contact_person 
from devices
left join vehicle_device on vehicle_device.device_id = devices.id 
left join vehicles on vehicles.id = vehicle_device.vehicle_id
left join company_vehicles on company_vehicles.vehicle_id = vehicles.id
left join companies on companies.id = company_vehicles.company_id
where devices.is_active = true
devices.device_eui ilike '%aaa%';

-- get all company vehicles have install devices before
select companies.id as cid, companies.company_name, vehicles.id as vid, vehicles.car_plate,
 vehicle_device.is_active as vehicle_device_active
from companies 
left join company_vehicles on company_vehicles.company_id = companies.id
left join vehicles on vehicles.id = company_vehicles.vehicle_id
left join vehicle_device on vehicle_device.vehicle_id = vehicles.id
where company_vehicles.id not in (select company_vehicles.id from companies
left join company_vehicles on company_vehicles.company_id = companies.id
left join vehicles on vehicles.id = company_vehicles.vehicle_id
left join vehicle_device on vehicle_device.vehicle_id = vehicles.id 
where vehicle_device.is_active = false)


-- get companies table join to devices table
select companies.id as cid, companies.company_name, 
companies.tel, companies.contact_person, companies.is_active as c_is_active, 
company_vehicles.id as cvid, company_vehicles.company_id, company_vehicles.vehicle_id, 
company_vehicles.is_active as cv_is_active, vehicles.id as vid, 
vehicles.car_plate, vehicles.vehicle_model, vehicles.vehicle_type, 
vehicles.is_active as v_is_active, vehicle_device.id as vdid, vehicle_device.device_id, 
vehicle_device.vehicle_id, vehicle_device.is_active as vd_is_active, 
devices.id as did, devices.device_name, devices.device_eui, devices.is_active as d_is_active
from companies
left join company_vehicles on company_vehicles.company_id = companies.id
left join vehicles on vehicles.id = company_vehicles.vehicle_id
left join vehicle_device on vehicle_device.vehicle_id = vehicles.id
left join devices on devices.id = vehicle_device.device_id

-- get companies table and count vehicles
select distinct(companies.id), companies.company_name, 
companies.tel, companies.contact_person, 
count(company_vehicles.company_id),companies.updated_at as c_updated_at 
from companies
left join company_vehicles on company_vehicles.company_id = companies.id
where companies.is_active = true and company_vehicles.is_active = true
group by companies.id
union 
select distinct(companies.id), companies.company_name, 
companies.tel, companies.contact_person, 
count(company_vehicles.company_id),companies.updated_at as c_updated_at
from companies
left join company_vehicles on company_vehicles.company_id = companies.id
where companies.is_active = true and company_vehicles.is_active is null
group by companies.id
order by c_updated_at

-- get count length for company below
select distinct(companies.id)
from companies
left join company_vehicles on company_vehicles.company_id = companies.id
where company_vehicles.is_active = true group by companies.id
union 
select distinct(companies.id) 
from companies
left join company_vehicles on company_vehicles.company_id = companies.id
where company_vehicles.is_active is null group by companies.id

-- get profile by id
select companies.id, companies.company_name, companies.tel, 
companies.contact_person, vehicles.id as vehicle_id, 
vehicles.car_plate, vehicles.vehicle_model, 
vehicles.vehicle_type,  
devices.id as device_id, devices.device_eui, 
devices.device_name
from companies
left join company_vehicles on company_vehicles.company_id = companies.id
left join vehicles on vehicles.id = company_vehicles.vehicle_id
left join vehicle_device on vehicle_device.vehicle_id = vehicles.id
left join devices on devices.id = vehicle_device.device_id
where companies.id = 9 and vehicle_device.is_active = true
union all
select companies.id, companies.company_name, companies.tel, 
companies.contact_person, vehicles.id as vehicle_id, 
vehicles.car_plate, vehicles.vehicle_model, 
vehicles.vehicle_type, 
devices.id as device_id, devices.device_eui, 
devices.device_name
from companies
left join company_vehicles on company_vehicles.company_id = companies.id
left join vehicles on vehicles.id = company_vehicles.vehicle_id
left join vehicle_device on vehicle_device.vehicle_id = vehicles.id
left join devices on devices.id = vehicle_device.device_id
where companies.id = 9 and vehicle_device.is_active is null