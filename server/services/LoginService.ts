import { Knex } from 'knex';
import { tables } from '../utils/table_model';

const { USERS, USER_DEVICES, DEVICES } = tables;

export class LoginService {
  constructor(private knex: Knex) {}

  getUser = async (email: string) => {
    const info = await this.knex
      .select<{
        id: number;
        email: string;
        password: string;
        role: string;
      }>('id', 'email', 'password', 'role')
      .from(USERS)
      .where({ email: email, is_active: true })
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
}
