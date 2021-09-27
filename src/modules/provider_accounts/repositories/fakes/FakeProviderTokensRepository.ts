import { uuid } from 'uuidv4';

import IProviderTokensRepository from '@modules/provider_accounts/repositories/IProviderTokensRepository';

import ProviderToken from '../../infra/typeorm/entities/ProviderToken';

class FakeProviderTokensRepository implements IProviderTokensRepository {
  private providerTokens: ProviderToken[] = [];

  public async generate(provider_id: string): Promise<ProviderToken> {
    const providerToken = new ProviderToken();

    Object.assign(providerToken, {
      id: uuid(),
      token: uuid(),
      provider_id,
      created_at: new Date(),
      updated: new Date(),
    });

    this.providerTokens.push(providerToken);

    return providerToken;
  }

  public async findByToken(token: string): Promise<ProviderToken | undefined> {
    const providerToken = this.providerTokens.find(
      findToken => findToken.token === token,
    );

    return providerToken;
  }

  public async save(provider_token: ProviderToken): Promise<ProviderToken> {
    const findIndex = this.providerTokens.findIndex(
      p => p.id === provider_token.id,
    );

    if (findIndex === -1) {
      this.providerTokens.push(provider_token);
      return provider_token;
    }

    this.providerTokens[findIndex] = provider_token;

    return provider_token;
  }
}

export default FakeProviderTokensRepository;
