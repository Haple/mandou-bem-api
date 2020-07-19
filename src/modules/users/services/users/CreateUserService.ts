import { injectable, inject } from 'tsyringe';
import { generate } from 'generate-password';
import path from 'path';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../../repositories/IUsersRepository';
import IHashProvider from '../../providers/HashProvider/models/IHashProvider';

import User from '../../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  account_id: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ name, email, account_id }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const password = generate({ length: 10, numbers: true });

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      account_id,
      password: hashedPassword,
      is_admin: false,
    });

    await this.cacheProvider.invalidatePrefix(`users-list-${account_id}`);

    const welcomeUserTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'welcome_user.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name,
        email,
      },
      subject: '[MandouBem] Boas vindas',
      templateData: {
        file: welcomeUserTemplate,
        variables: {
          name,
          email,
          password,
          link: process.env.APP_WEB_URL || '',
        },
      },
    });

    return user;
  }
}

export default CreateUserService;
