import { getRepository, Repository, Not, Like } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';

import IFindUsersByUsernameDTO from '@modules/users/dtos/IFindUsersByUsernameDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async findAllUsers({
    except_user_id,
    account_id,
  }: IFindAllUsersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
          account_id,
        },
      });
    } else {
      users = await this.ormRepository.find({
        where: {
          account_id,
        },
      });
    }

    return users;
  }

  public async findUsersByUsername({
    except_user_id,
    account_id,
    username_like,
  }: IFindUsersByUsernameDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
          account_id,
          email: Like(`%${username_like}%`),
        },
      });
    } else {
      users = await this.ormRepository.find({
        where: {
          account_id,
          email: Like(`%${username_like}%`),
        },
      });
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async remove(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }
}

export default UsersRepository;
