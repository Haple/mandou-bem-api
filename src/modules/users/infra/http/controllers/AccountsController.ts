import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateAccountService from '@modules/users/services/CreateAccountService';

export default class AccountsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { company_name, name, email, password } = request.body;

    const createAccount = container.resolve(CreateAccountService);

    const account = await createAccount.execute({
      company_name,
      name,
      email,
      password,
    });

    return response.json(classToClass(account));
  }
}
