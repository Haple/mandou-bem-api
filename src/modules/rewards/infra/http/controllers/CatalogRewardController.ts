import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCatalogRewardService from '@modules/rewards/services/catalog_rewards/CreateCatalogRewardService';
import UpdateCatalogRewardService from '@modules/rewards/services/catalog_rewards/UpdateCatalogRewardService';
import DeleteCatalogRewardService from '@modules/rewards/services/catalog_rewards/DeleteCatalogRewardService';
import CatalogRewardsRepository from '../../typeorm/repositories/CatalogRewardsRepository';

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
    const { account_id } = request.user;

    const catalogRewardsRepository = container.resolve(
      CatalogRewardsRepository,
    );

    const catalog_rewards = await catalogRewardsRepository.findAllFromAccount(
      account_id,
    );

    return response.json(classToClass(catalog_rewards));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { catalog_reward_id } = request.params;
    const { account_id } = request.user;

    const deleteCatalogReward = container.resolve(DeleteCatalogRewardService);

    await deleteCatalogReward.execute({
      account_id,
      catalog_reward_id,
    });

    return response.json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { catalog_reward_id } = request.params;
    const { title, image_url, points } = request.body;
    const { account_id } = request.user;

    const updateCatalogReward = container.resolve(UpdateCatalogRewardService);

    const catalog_reward = await updateCatalogReward.execute({
      catalog_reward_id,
      title,
      image_url,
      points,
      account_id,
    });

    return response.json(classToClass(catalog_reward));
  }
}
