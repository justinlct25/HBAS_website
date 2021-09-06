import { tables } from './../utils/table_model';
import { Knex } from 'knex';
import { hashPassword } from '../utils/hash';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tables.USERS).del();

  // Inserts seed entries
  const mockPw = await hashPassword('123');

  await knex(tables.USERS).insert([
    { email: 'admin_1@test.com', password: mockPw, role: 'ADMIN' },
    { email: 'admin_2@test.com', password: mockPw, role: 'ADMIN' },
    { email: 'admin_3@test.com', password: mockPw, role: 'ADMIN' },
    { email: 'user_1@test.com', password: mockPw },
    { email: 'user_2@test.com', password: mockPw },
    { email: 'user_3@test.com', password: mockPw },
  ]);
}
