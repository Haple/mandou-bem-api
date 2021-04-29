import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListCatalogRewardsService from '@modules/rewards/services/catalog/ListCatalogRewardsService';

export default class CatalogController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;

    const listCatalogRewards = container.resolve(ListCatalogRewardsService);

    const rewards = await listCatalogRewards.execute({ account_id });

    return response.json(classToClass(rewards));
  }
}
