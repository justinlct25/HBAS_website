import { Knex } from 'knex';
import { IUserInfo, Roles } from '../models/models';
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
      .select<IUserInfo>('id', 'email', 'role', 'devicesCount')
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
}
