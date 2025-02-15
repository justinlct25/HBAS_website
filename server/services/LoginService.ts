import { Knex } from 'knex';
import { tables } from '../utils/table_model';

const { USERS, USER_DEVICES, DEVICES } = tables;

export class LoginService {
  constructor(private knex: Knex) {}

  getUser = async (username: string) => {
    const info = await this.knex
      .select<{
        id: number;
        username: string;
        password: string;
        role: string;
      }>('id', 'username', 'password', 'role')
      .from(USERS)
      .where({ username, is_active: true })
      .first();

    const tempUsers = 'temp_users';
    const devicesQuery = this.knex
      .with(tempUsers, (qb) => {
        qb.select('device_id', 'user_id').from(USER_DEVICES).where('is_active', true);
      })
      .distinct<{ id: number }[]>(`${DEVICES}.id`)
      .from(DEVICES)
      .innerJoin(tempUsers, `${tempUsers}.device_id`, `${DEVICES}.id`)
      .where(`${tempUsers}.user_id`, info?.id);

    return {
      info,
      devices: info?.role === 'USER' ? (await devicesQuery).map((d) => d.id) : null,
    };
  };

  checkPassword = async (userId: number) => {
    return await this.knex(tables.USERS)
      .select<{ password: string }>('password')
      .where('id', userId)
      .andWhere('is_active', true)
      .first();
  };

  changePassword = async (userId: number, newPassword: string) => {
    return await this.knex(tables.USERS)
      .update(
        {
          password: newPassword,
          updated_at: new Date(Date.now()),
        },
        'id'
      )
      .where('id', userId)
      .andWhere('is_active', true);
  };
}
