import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IProviderAccountsRepository from '../../repositories/IProviderAccountsRepository';
import IProviderTokensRepository from '../../repositories/IProviderTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('ProviderAccountsRepository')
    private providerAccountsRepository: IProviderAccountsRepository,

    @inject('ProviderTokensRepository')
    private providerTokensRepository: IProviderTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const providerToken = await this.providerTokensRepository.findByToken(
      token,
    );

    if (!providerToken) {
      throw new AppError('Provider token does not exists');
    }

    const { provider_account } = providerToken;

    const tokenCreatedAt = providerToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    provider_account.password = await this.hashProvider.generateHash(password);

    await this.providerAccountsRepository.save(provider_account);
  }
}

export default ResetPasswordService;
