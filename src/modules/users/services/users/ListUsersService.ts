import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../../repositories/IUsersRepository';

import User from '../../infra/typeorm/entities/User';

interface IRequest {
  account_id: string;
  username_like?: string;
  except_user_id: string;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    account_id,
    username_like,
    except_user_id,
  }: IRequest): Promise<User[]> {
    if (username_like) {
      return this.usersRepository.findUsersByUsername({
        account_id,
        except_user_id,
        username_like,
      });
    }
    return this.usersRepository.findAllUsers({
      account_id,
      except_user_id,
    });
  }
}

export default ListUsersService;
