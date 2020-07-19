import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/users/CreateUserService';
import ListUsersService from '@modules/users/services/users/ListUsersService';
import DeleteUserService from '@modules/users/services/users/DeleteUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const { account_id } = request.user;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      account_id,
    });

    return response.json(classToClass(user));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const username_like = request.query.username_like as string;
    const { account_id, id } = request.user;

    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute({
      account_id,
      except_user_id: id,
      username_like,
    });

    return response.json(classToClass(users));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const { account_id } = request.user;

    const deleteUser = container.resolve(DeleteUserService);

    const users = await deleteUser.execute({
      account_id,
      user_id,
    });

    return response.json(classToClass(users));
  }
}
