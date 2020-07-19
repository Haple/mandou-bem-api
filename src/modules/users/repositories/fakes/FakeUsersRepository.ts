import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';

import IFindUsersByUsernameDTO from '@modules/users/dtos/IFindUsersByUsernameDTO';
import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findAllUsers({
    except_user_id,
  }: IFindAllUsersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  public async findUsersByUsername({
    except_user_id,
    account_id,
    username_like,
  }: IFindUsersByUsernameDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(
        user =>
          user.id !== except_user_id &&
          user.account_id === account_id &&
          user.email.includes(username_like),
      );
    } else {
      users = this.users.filter(
        user =>
          user.account_id === account_id && user.email.includes(username_like),
      );
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async remove(user: User): Promise<void> {
    this.users.splice(this.users.indexOf(user), 1);
  }
}

export default FakeUsersRepository;
