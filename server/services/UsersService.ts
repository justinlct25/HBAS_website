import { Knex } from 'knex';
import { IUserInfo, Roles } from '../models/models';
import { hashPassword } from '../utils/hash';
import { logger } from '../utils/logger';
import { tables } from './../utils/table_model';

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
          .from(tables.USER_DEVICES)
          .where('is_active', true)
          .groupBy('user_id')
          .orderBy('user_id');
      })
      .select<IUserInfo>('id', 'username', 'email', 'role', 'devicesCount')
      .from(tables.USERS)
      .leftJoin(tempCountTable, `${tables.USERS}.id`, `${tempCountTable}.user_id`)
      .where('is_active', true)
      .orderBy([
        { column: 'role', order: 'asc' },
        { column: 'updated_at', order: 'desc' },
        { column: 'email', order: 'asc' },
      ]);

    if (!!searchString) query.andWhere('email', 'ILIKE', searchString);
    if (!!role) query.andWhere('role', role);
    return await query.paginate<IUserInfo[]>({ perPage, currentPage, isLengthAware: true });
  };

  checkDuplicatedUser = async (username: string, email: string) => {
    return await this.knex(tables.USERS)
      .distinct('id')
      .where('is_active', true)
      .andWhere((builder) => {
        builder.where('username', 'ILIKE', username).orWhere('email', 'ILIKE', email);
      })
      .first();
  };

  addUser = async (username: string, email: string, role?: string) => {
    const password = await hashPassword(email);
    return await this.knex(tables.USERS)
      .insert({ username, email, password, role })
      .returning<number[]>('id');
  };

  editUser = async (userId: number, username: string, email: string, role?: string) => {
    return await this.knex(tables.USERS)
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

      await query().from(tables.USER_DEVICES).andWhere({ user_id: userId });
      const ids = await query().from(tables.USERS).andWhere({ id: userId });

      await trx.commit();
      return ids;
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };
}
