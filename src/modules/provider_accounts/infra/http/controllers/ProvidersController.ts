import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/provider_accounts/services/provider_accounts/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const ListProviders = container.resolve(ListProvidersService);

    const provider_account = await ListProviders.execute();

    return response.json(classToClass(provider_account));
  }
}
