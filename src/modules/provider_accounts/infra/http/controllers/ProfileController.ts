import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/provider_accounts/services/profile/UpdateProfileService';
import ShowProfileService from '@modules/provider_accounts/services/profile/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const provider_id = request.provider.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ provider_id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const provider_id = request.provider.id;
    const {
      company_name,
      cnpj,
      name,
      email,
      old_password,
      password,
    } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      provider_id,
      name,
      email,
      old_password,
      password,
      company_name,
      cnpj,
    });

    return response.json(classToClass(user));
  }
}
