import { Knex } from 'knex';
import { ICompanyInfo } from '../models/models';
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

  checkDuplicatedCompany = async (companyName: string) => {
    return await this.knex(tables.COMPANIES)
      .distinct<{ id: number }>('id')
      .where('is_active', true)
      .andWhere('company_name', 'ILIKE', companyName)
      .first();
  };

  addCompany = async (company_name: string, tel: string, contact_person: string | null) => {
    return await this.knex(tables.COMPANIES)
      .insert({ company_name, tel, contact_person })
      .returning<number[]>('id');
  };

  editCompany = async (
    companyId: number,
    company_name: string,
    tel: string,
    contact_person: string | null
  ) => {
    return await this.knex(tables.COMPANIES)
      .update({ company_name, tel, contact_person, updated_at: new Date() }, 'id')
      .where({
        is_active: true,
        id: companyId,
      });
  };
}
