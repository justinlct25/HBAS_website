import { Knex } from 'knex';
import { IDeviceDetail, IDeviceInfo, IUserInfo, Roles } from '../models/models';
import { hashPassword } from '../utils/hash';
import { logger } from '../utils/logger';
import { tables } from './../utils/table_model';

const { USER_DEVICES, USERS, DEVICES, COMPANY_VEHICLES, VEHICLE_DEVICE, COMPANIES, VEHICLES } =
  tables;
export class UsersService {
  constructor(private knex: Knex) {}

  getUsers = async (
    perPage: number,
    currentPage: number,
    searchString: string | null,
    role: Roles | null
  ) => {
    const tempCountTable = 'temp_count';

    const query = this.knex
      .with(tempCountTable, (qb) => {
        qb.select('user_id')
          .count('user_id AS devicesCount')
          .from(USER_DEVICES)
          .where('is_active', true)
          .groupBy('user_id')
          .orderBy('user_id');
      })
      .select<IUserInfo>('id', 'username', 'email', 'role', 'devicesCount')
      .from(USERS)
      .leftJoin(tempCountTable, `${USERS}.id`, `${tempCountTable}.user_id`)
      .where('is_active', true)
      .orderBy([
        { column: 'role', order: 'asc' },
        { column: 'updated_at', order: 'desc' },
        { column: 'username', order: 'asc' },
        { column: 'email', order: 'asc' },
      ]);

    const searchQuery = (builder: Knex.QueryBuilder) => {
      builder.where('username', 'ILIKE', searchString).orWhere('email', 'ILIKE', searchString);
    };

    if (!!searchString) query.andWhere(searchQuery);
    if (!!role) query.andWhere('role', role);
    return await query.paginate<IUserInfo[]>({ perPage, currentPage, isLengthAware: true });
  };

  getUsersForm = async (searchString: string | null, role: Roles | null) => {
    const query = this.knex(USERS)
      .select<Omit<IUserInfo, 'devicesCount'>>('id', 'username', 'email', 'role')
      .where('is_active', true)
      .orderBy([
        { column: 'role', order: 'asc' },
        { column: 'username', order: 'asc' },
        { column: 'email', order: 'asc' },
        { column: 'updated_at', order: 'desc' },
      ]);

    const searchQuery = (builder: Knex.QueryBuilder) => {
      builder.where('username', 'ILIKE', searchString).orWhere('email', 'ILIKE', searchString);
    };

    if (!!searchString) query.andWhere(searchQuery);
    if (!!role) query.andWhere('role', role);
    return await query;
  };

  checkDuplicatedUser = async (username: string) => {
    return await this.knex(USERS)
      .distinct('id')
      .where('is_active', true)
      .andWhere('username', 'ILIKE', username)
      .first();
  };

  addUser = async (username: string, email: string, role?: string) => {
    const password = await hashPassword(username);
    return await this.knex(USERS)
      .insert({ username, email, password, role })
      .returning<number[]>('id');
  };

  editUser = async (userId: number, username: string, email: string, role?: string) => {
    return await this.knex(USERS)
      .update({ username, email, role, updated_at: new Date() }, 'id')
      .where({
        is_active: true,
        id: userId,
      });
  };

  deleteUser = async (userId: number) => {
    const trx = await this.knex.transaction();
    try {
      const query = () => {
        return trx
          .update({ is_active: false, updated_at: new Date() }, 'id')
          .where({ is_active: true });
      };

      await query().from(USER_DEVICES).andWhere({ user_id: userId });
      const ids = await query().from(USERS).andWhere({ id: userId });

      await trx.commit();
      return ids;
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };

  getUserDevicesList = async (userId: number, perPage: number, currentPage: number) => {
    const tempUsers = 'temp_users';

    const query = this.knex
      .with(tempUsers, (qb) => {
        qb.select('device_id', 'user_id').from(USER_DEVICES).where('is_active', true);
      })
      .distinct<IDeviceDetail[]>({
        deviceId: `${DEVICES}.id`,
        deviceName: `${DEVICES}.device_name`,
        deviceEui: `${DEVICES}.device_eui`,
        deviceIsActive: `${DEVICES}.is_active`,
        vehicleId: `${VEHICLES}.id`,
        carPlate: `${VEHICLES}.car_plate`,
        vehicleIsActive: `${VEHICLES}.is_active`,
        companyId: `${COMPANIES}.id`,
        companyName: `${COMPANIES}.company_name`,
        tel: `${COMPANIES}.tel`,
        contactPerson: `${COMPANIES}.contact_person`,
        companyIsActive: `${COMPANIES}.is_active`,
        updatedAt: `${DEVICES}.updated_at`,
      })
      .from(DEVICES)
      .leftJoin(VEHICLE_DEVICE, `${DEVICES}.id`, `${VEHICLE_DEVICE}.device_id`)
      .leftJoin(VEHICLES, `${VEHICLES}.id`, `${VEHICLE_DEVICE}.vehicle_id`)
      .leftJoin(COMPANY_VEHICLES, `${COMPANY_VEHICLES}.vehicle_id`, `${VEHICLES}.id`)
      .leftJoin(COMPANIES, `${COMPANY_VEHICLES}.company_id`, `${COMPANIES}.id`)
      .innerJoin(tempUsers, `${tempUsers}.device_id`, `${DEVICES}.id`)
      .where(`${tempUsers}.user_id`, userId)
      .orderBy([
        { column: `${DEVICES}.updated_at`, order: 'desc' },
        { column: `${DEVICES}.device_name`, order: 'asc' },
      ]);

    return await query.paginate<IDeviceDetail[]>({ perPage, currentPage, isLengthAware: true });
  };

  getDevicesForm = async (deviceId: number | null) => {
    const query = () => {
      return this.knex(DEVICES)
        .distinct<IDeviceInfo[]>({ id: 'id', deviceName: 'device_name', deviceEui: 'device_eui' })
        .where('is_active', true)
        .andWhereNot('id', deviceId)
        .orderBy('device_eui');
    };

    const filterQuery = (builder: Knex.QueryBuilder) => {
      builder
        .select<{ device_id: number }>('device_id')
        .from(USER_DEVICES)
        .whereRaw(/* SQL*/ `${DEVICES}.id = ${USER_DEVICES}.device_id`)
        .andWhere('is_active', true);
    };

    return {
      linkedDevices: await query().whereExists(filterQuery),
      newDevices: await query().whereNotExists(filterQuery),
    };
  };

  linkDeviceAndUser = async (userId: number, deviceIds: number[]) => {
    const trx = await this.knex.transaction();
    try {
      // link up new device and user
      const ids = await trx(USER_DEVICES)
        .insert(
          deviceIds.map((device_id) => ({
            device_id,
            user_id: userId,
          }))
        )
        .returning<number[]>('id');

      await trx.commit();
      return ids;
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };

  unlinkDeviceAndUser = async (userId: number, deviceIds: number[]) => {
    return await this.knex(USER_DEVICES)
      .update({ is_active: false, updated_at: new Date() }, 'id')
      .where({ is_active: true })
      .andWhere((builder) => {
        builder.whereIn('device_id', deviceIds).andWhere({ user_id: userId });
      });
  };
}
