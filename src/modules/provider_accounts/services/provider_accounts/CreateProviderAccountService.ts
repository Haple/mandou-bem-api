import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

import IProviderAccountsRepository from '../../repositories/IProviderAccountsRepository';

import ProviderAccount from '../../infra/typeorm/entities/ProviderAccount';

interface IRequest {
  company_name: string;
  cnpj: string;
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateProviderAccountService {
  constructor(
    @inject('ProviderAccountsRepository')
    private providerAccountsRepository: IProviderAccountsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    company_name,
    cnpj,
    name,
    email,
    password,
  }: IRequest): Promise<ProviderAccount> {
    const checkProviderExists = await this.providerAccountsRepository.findByEmail(
      email,
    );

    if (checkProviderExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const provider = await this.providerAccountsRepository.create({
      company_name,
      cnpj,
      name,
      email,
      password: hashedPassword,
    });

    return provider;
  }
}

export default CreateProviderAccountService;
