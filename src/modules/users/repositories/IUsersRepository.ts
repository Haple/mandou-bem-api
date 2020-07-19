import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllUsersDTO from '../dtos/IFindAllUsersDTO';
import IFindUsersByUsernameDTO from '../dtos/IFindUsersByUsernameDTO';

export default interface IUsersRepository {
  findAllUsers(data: IFindAllUsersDTO): Promise<User[]>;
  findUsersByUsername(data: IFindUsersByUsernameDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  remove(user: User): Promise<void>;
}
