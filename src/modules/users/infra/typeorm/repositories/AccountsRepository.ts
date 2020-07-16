import { getRepository, Repository } from 'typeorm';

import IAccountsRepository from '@modules/users/repositories/IAccountsRepository';

import Account from '../entities/Account';

class AccountsRepository implements IAccountsRepository {
  private ormRepository: Repository<Account>;

  constructor() {
    this.ormRepository = getRepository(Account);
  }

  public async create(company_name: string): Promise<Account> {
    const account = this.ormRepository.create({ company_name });

    await this.ormRepository.save(account);

    return account;
  }
}

export default AccountsRepository;
