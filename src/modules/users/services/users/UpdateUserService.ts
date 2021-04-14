import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IDepartmentsRepository from '@modules/users/repositories/IDepartmentsRepository';
import IPositionsRepository from '@modules/users/repositories/IPositionsRepository';
import IUsersRepository from '../../repositories/IUsersRepository';

import User from '../../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  account_id: string;
  department_id: string;
  position_id: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('PositionsRepository')
    private positionsRepository: IPositionsRepository,

    @inject('DepartmentsRepository')
    private departmentsRepository: IDepartmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    account_id,
    department_id,
    position_id,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user || user.account_id !== account_id) {
      throw new AppError('User not found.');
    }

    const department = await this.departmentsRepository.findById(department_id);

    if (!department || department.account_id !== account_id) {
      throw new AppError('Department not found.');
    }

    const position = await this.positionsRepository.findById(position_id);

    if (!position || position.account_id !== account_id) {
      throw new AppError('Position not found.');
    }

    user.position = position;
    user.department = department;

    return this.usersRepository.save(user);
  }
}

export default UpdateUserService;
