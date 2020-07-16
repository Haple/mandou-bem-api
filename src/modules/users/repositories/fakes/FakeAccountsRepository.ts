import { uuid } from 'uuidv4';

import IAccountsRepository from '@modules/users/repositories/IAccountsRepository';

import Account from '../../infra/typeorm/entities/Account';

class FakeAccountsRepository implements IAccountsRepository {
  private users: Account[] = [];

  public async create(company_name: string): Promise<Account> {
    const account = new Account();

    Object.assign(account, { id: uuid(), company_name });

    this.users.push(account);

    return account;
  }
}

export default FakeAccountsRepository;
