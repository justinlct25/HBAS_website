import { Knex } from 'knex';
import { tables } from '../utils/table_model';

const { USERS } = tables;

export class LoginService {
  constructor(private knex: Knex) {}

  getUser = async (email: string) => {
    return await this.knex
      .select<{
        id: number;
        email: string;
        password: string;
        role: string;
      }>('id', 'email', 'password', 'role')
      .from(USERS)
      .where({ email: email, is_active: true })
      .first();
  };
}
