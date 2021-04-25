import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../../repositories/IUsersRepository';

import IAccountsRepository from '../../repositories/IAccountsRepository';

import Account from '../../infra/typeorm/entities/Account';

interface IRequest {
  company_name: string;
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateAccountService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    company_name,
    name,
    email,
    password,
  }: IRequest): Promise<Account> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const account = await this.accountsRepository.create(company_name);

    await this.usersRepository.create({
      name,
      email,
      account_id: account.id,
      password: hashedPassword,
      is_admin: true,
    });

    return account;
  }
}

export default CreateAccountService;
