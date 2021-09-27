import ICreateProviderAccountDTO from '@modules/provider_accounts/dtos/ICreateProviderAccountDTO';
import { uuid } from 'uuidv4';

import ProviderAccount from '../../infra/typeorm/entities/ProviderAccount';
import IProviderAccountsRepository from '../IProviderAccountsRepository';

class FakeProviderAccountsRepository implements IProviderAccountsRepository {
  private providers: ProviderAccount[] = [];

  public async findAll(): Promise<ProviderAccount[]> {
    return this.providers;
  }

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

  public async save(
    provider_account: ProviderAccount,
  ): Promise<ProviderAccount> {
    const findIndex = this.providers.findIndex(
      p => p.id === provider_account.id,
    );

    if (findIndex === -1) {
      this.providers.push(provider_account);
      return provider_account;
    }

    this.providers[findIndex] = provider_account;

    return provider_account;
  }

  public async findById(id: string): Promise<ProviderAccount | undefined> {
    const provider = this.providers.find(p => p.id === id);
    return provider;
  }
}

export default FakeProviderAccountsRepository;
