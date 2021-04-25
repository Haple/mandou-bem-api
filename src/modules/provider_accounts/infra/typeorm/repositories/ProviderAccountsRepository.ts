import { getRepository, Repository } from 'typeorm';

import IProviderAccountsRepository from '@modules/provider_accounts/repositories/IProviderAccountsRepository';
import ICreateProviderAccountDTO from '@modules/provider_accounts/dtos/ICreateProviderAccountDTO';
import ProviderAccount from '../entities/ProviderAccount';

class ProviderAccountsRepository implements IProviderAccountsRepository {
  private ormRepository: Repository<ProviderAccount>;

  constructor() {
    this.ormRepository = getRepository(ProviderAccount);
  }

  public async findByEmail(
    email: string,
  ): Promise<ProviderAccount | undefined> {
    const provider = await this.ormRepository.findOne({
      where: { email },
    });

    return provider;
  }

  public async create(
    providerData: ICreateProviderAccountDTO,
  ): Promise<ProviderAccount> {
    const provider = this.ormRepository.create(providerData);

    await this.ormRepository.save(provider);

    return provider;
  }
}

export default ProviderAccountsRepository;
