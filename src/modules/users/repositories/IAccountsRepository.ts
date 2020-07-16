import Account from '../infra/typeorm/entities/Account';

export default interface IAccountsRepository {
  create(company_name: string): Promise<Account>;
}
