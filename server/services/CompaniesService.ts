import { Knex } from 'knex';
import { ICompanyInfo, IVehicleDetail } from '../models/models';
import { tables } from './../utils/table_model';

export class CompaniesService {
  constructor(private knex: Knex) {}

  getCompanyDetails = async (companyId: number) => {
    return await this.knex(tables.COMPANIES)
      .select<ICompanyInfo>({
        companyName: 'company_name',
        tel: 'tel',
        contactPerson: 'contact_person',
        updatedAt: 'updated_at',
      })
      .where({ is_active: true, id: companyId })
      .first();
  };

  getCompaniesInfo = async (perPage: number, currentPage: number, searchString: string | null) => {
    const tempCountTable = 'temp_count';

    const query = this.knex
      .with(tempCountTable, (qb) => {
        qb.select('company_id')
          .count('company_id AS vehiclesCount')
          .from(tables.COMPANY_VEHICLES)
          .where('is_active', true)
          .groupBy('company_id')
          .orderBy('company_id');
      })
      .select<ICompanyInfo>({
        id: `${tables.COMPANIES}.id`,
        companyName: `${tables.COMPANIES}.company_name`,
        tel: `${tables.COMPANIES}.tel`,
        contactPerson: `${tables.COMPANIES}.contact_person`,
        updatedAt: `${tables.COMPANIES}.updated_at`,
        vehiclesCount: `${tempCountTable}.vehiclesCount`,
      })
      .from(tables.COMPANIES)
      .leftJoin(tempCountTable, `${tables.COMPANIES}.id`, `${tempCountTable}.company_id`)
      .where(`${tables.COMPANIES}.is_active`, true)
      .orderBy([
        { column: `${tables.COMPANIES}.updated_at`, order: 'desc' },
        { column: `${tables.COMPANIES}.company_name`, order: 'asc' },
      ]);

    const searchQuery = (builder: Knex.QueryBuilder) => {
      builder
        .where(`${tables.COMPANIES}.company_name`, 'ILIKE', searchString)
        .orWhere(`${tables.COMPANIES}.tel`, 'ILIKE', searchString)
        .orWhere(`${tables.COMPANIES}.contact_person`, 'ILIKE', searchString);
    };

    if (!!searchString) query.andWhere(searchQuery);
    return await query.paginate<ICompanyInfo[]>({ perPage, currentPage, isLengthAware: true });
  };

  getCompanyVehicles = async (companyId: number) => {
    const tempVehicles = 'temp_vehicles';
    const tempDevices = 'temp_devices';

    return await this.knex
      .with(tempVehicles, (qb) => {
        qb.distinct({
          vehicleId: `${tables.VEHICLES}.id`,
          carPlate: `${tables.VEHICLES}.car_plate`,
          vehicleModel: `${tables.VEHICLES}.vehicle_model`,
          vehicleType: `${tables.VEHICLES}.vehicle_type`,
          updatedAt: `${tables.VEHICLES}.updated_at`,
        })
          .from(tables.VEHICLES)
          .innerJoin(
            tables.COMPANY_VEHICLES,
            `${tables.VEHICLES}.id`,
            `${tables.COMPANY_VEHICLES}.vehicle_id`
          )
          .where({
            [`${tables.VEHICLES}.is_active`]: true,
            [`${tables.COMPANY_VEHICLES}.is_active`]: true,
            [`${tables.COMPANY_VEHICLES}.company_id`]: companyId,
          });
      })
      .with(tempDevices, (qb) => {
        qb.distinct({
          vehicleId: `${tables.VEHICLE_DEVICE}.vehicle_id`,
          deviceId: `${tables.DEVICES}.id`,
          deviceName: `${tables.DEVICES}.device_name`,
          deviceEui: `${tables.DEVICES}.device_eui`,
        })
          .from(tables.DEVICES)
          .innerJoin(
            tables.VEHICLE_DEVICE,
            `${tables.VEHICLE_DEVICE}.device_id`,
            `${tables.DEVICES}.id`
          )
          .where({
            [`${tables.DEVICES}.is_active`]: true,
            [`${tables.VEHICLE_DEVICE}.is_active`]: true,
          });
      })
      .select<IVehicleDetail[]>([
        `${tempVehicles}.*`,
        `${tempDevices}.deviceId`,
        `${tempDevices}.deviceName`,
        `${tempDevices}.deviceEui`,
      ])
      .from(tempVehicles)
      .leftJoin(tempDevices, `${tempVehicles}.vehicleId`, `${tempDevices}.vehicleId`)
      .orderBy([
        { column: `${tempVehicles}.updatedAt`, order: 'desc' },
        { column: `${tempVehicles}.carPlate`, order: 'asc' },
      ]);
  };
}
