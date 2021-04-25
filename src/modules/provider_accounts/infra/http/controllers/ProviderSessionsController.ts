import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateProviderService from '@modules/provider_accounts/services/sessions/AuthenticateProviderService';

export default class ProviderSessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateProvider = container.resolve(AuthenticateProviderService);

    const { provider, token } = await authenticateProvider.execute({
      email,
      password,
    });

    return response.json({ provider: classToClass(provider), token });
  }
}
