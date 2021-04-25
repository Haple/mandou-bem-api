import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateProviderAccountService from '@modules/provider_accounts/services/provider_accounts/CreateProviderAccountService';

export default class AccountsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { company_name, cnpj, name, email, password } = request.body;

    const CreateProviderAccount = container.resolve(
      CreateProviderAccountService,
    );

    const provider_account = await CreateProviderAccount.execute({
      company_name,
      cnpj,
      name,
      email,
      password,
    });

    return response.json(classToClass(provider_account));
  }
}
