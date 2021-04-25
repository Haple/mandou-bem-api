import ICreateProviderAccountDTO from '@modules/provider_accounts/dtos/ICreateProviderAccountDTO';
import { uuid } from 'uuidv4';

import ProviderAccount from '../../infra/typeorm/entities/ProviderAccount';
import IProviderAccountsRepository from '../IProviderAccountsRepository';

class FakeProviderAccountsRepository implements IProviderAccountsRepository {
  private providers: ProviderAccount[] = [];

  public async findByEmail(
    email: string,
  ): Promise<ProviderAccount | undefined> {
    const findProvider = this.providers.find(
      provider => provider.email === email,
    );

    return findProvider;
  }

  public async create(
    providerData: ICreateProviderAccountDTO,
  ): Promise<ProviderAccount> {
    const provider = new ProviderAccount();

    Object.assign(provider, { id: uuid() }, providerData);

    this.providers.push(provider);

    return provider;
  }
}

export default FakeProviderAccountsRepository;
