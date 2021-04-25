import { injectable, inject } from 'tsyringe';
import { generate } from 'generate-password';
import path from 'path';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IDepartmentsRepository from '@modules/users/repositories/IDepartmentsRepository';
import IPositionsRepository from '@modules/users/repositories/IPositionsRepository';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../../repositories/IUsersRepository';

import User from '../../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  account_id: string;
  department_id: string;
  position_id: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('PositionsRepository')
    private positionsRepository: IPositionsRepository,

    @inject('DepartmentsRepository')
    private departmentsRepository: IDepartmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
    name,
    email,
    account_id,
    department_id,
    position_id,
  }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const department = await this.departmentsRepository.findById(department_id);

    if (!department || department.account_id !== account_id) {
      throw new AppError('Department not found.');
    }

    const position = await this.positionsRepository.findById(position_id);

    if (!position || position.account_id !== account_id) {
      throw new AppError('Position not found.');
    }

    const password = generate({ length: 10, numbers: true });

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      account_id,
      position_id,
      department_id,
      password: hashedPassword,
      is_admin: false,
    });

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
