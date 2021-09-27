import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IProviderAccountsRepository from '../../repositories/IProviderAccountsRepository';

import ProviderAccount from '../../infra/typeorm/entities/ProviderAccount';

interface IRequest {
  provider_id: string;
  company_name: string;
  cnpj: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('ProviderAccountsRepository')
    private providerAccountsRepository: IProviderAccountsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    provider_id,
    company_name,
    cnpj,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<ProviderAccount> {
    const provider = await this.providerAccountsRepository.findById(
      provider_id,
    );

    if (!provider) {
      throw new AppError('Provider not found');
    }

    const providerWithUpdatedEmail = await this.providerAccountsRepository.findByEmail(
      email,
    );

    if (
      providerWithUpdatedEmail &&
      providerWithUpdatedEmail.id !== provider_id
    ) {
      throw new AppError('E-mail already in use');
    }

    provider.company_name = company_name;
    provider.cnpj = cnpj;
    provider.name = name;
    provider.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        provider.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      provider.password = await this.hashProvider.generateHash(password);
    }

    return this.providerAccountsRepository.save(provider);
  }
}

export default UpdateProfileService;
