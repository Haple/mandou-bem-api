import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IProviderAccountsRepository from '../../repositories/IProviderAccountsRepository';

import ProviderAccount from '../../infra/typeorm/entities/ProviderAccount';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  provider: ProviderAccount;
  token: string;
}

@injectable()
class AuthenticateProviderService {
  constructor(
    @inject('ProviderAccountsRepository')
    private providerAccountsRepository: IProviderAccountsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const provider = await this.providerAccountsRepository.findByEmail(email);

    if (!provider) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      provider.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      {
        provider_name: provider.company_name,
      },
      secret,
      {
        subject: provider.id,
        expiresIn,
      },
    );

    return {
      provider,
      token,
    };
  }
}

export default AuthenticateProviderService;
