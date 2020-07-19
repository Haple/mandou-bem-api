import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/users/CreateUserService';

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
}
