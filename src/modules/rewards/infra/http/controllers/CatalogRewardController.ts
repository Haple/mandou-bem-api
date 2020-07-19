import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCatalogRewardService from '@modules/rewards/services/CreateCatalogRewardService';
import ListCatalogRewardsService from '@modules/rewards/services/ListCatalogRewardsService';
import DeleteCatalogRewardService from '@modules/rewards/services/DeleteCatalogRewardService';

export default class CatalogRewardController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { title, image_url, points } = request.body;
    const { account_id } = request.user;

    const createCatalogReward = container.resolve(CreateCatalogRewardService);

    const catalog_reward = await createCatalogReward.execute({
      title,
      image_url,
      points,
      account_id,
    });

    return response.json(classToClass(catalog_reward));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const username_like = request.query.username_like as string;
    const { account_id, id } = request.user;

    const listUsers = container.resolve(ListCatalogRewardsService);

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

    const deleteUser = container.resolve(DeleteCatalogRewardService);

    const users = await deleteUser.execute({
      account_id,
      user_id,
    });

    return response.json(classToClass(users));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { title, image_url, points } = request.body;
    const { account_id } = request.user;

    const createCatalogReward = container.resolve(CreateCatalogRewardService);

    const catalog_reward = await createCatalogReward.execute({
      title,
      image_url,
      points,
      account_id,
    });

    return response.json(classToClass(catalog_reward));
  }
}
