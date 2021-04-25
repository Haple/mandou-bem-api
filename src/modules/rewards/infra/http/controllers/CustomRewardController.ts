import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCustomRewardService from '@modules/rewards/services/custom_rewards/CreateCustomRewardService';
import UpdateCustomRewardService from '@modules/rewards/services/custom_rewards/UpdateCustomRewardService';
import DeleteCustomRewardService from '@modules/rewards/services/custom_rewards/DeleteCustomRewardService';
import CustomRewardsRepository from '../../typeorm/repositories/CustomRewardsRepository';

export default class CustomRewardController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      title,
      image_url,
      points,
      units_available,
      expiration_days,
      description,
    } = request.body;
    const { account_id } = request.user;

    const createCustomReward = container.resolve(CreateCustomRewardService);

    const custom_reward = await createCustomReward.execute({
      title,
      image_url,
      points,
      account_id,
      units_available,
      expiration_days,
      description,
    });

    return response.json(classToClass(custom_reward));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;

    const customRewardsRepository = container.resolve(CustomRewardsRepository);

    const custom_rewards = await customRewardsRepository.findAllFromAccount(
      account_id,
    );

    return response.json(classToClass(custom_rewards));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { custom_reward_id } = request.params;
    const { account_id } = request.user;

    const deleteCustomReward = container.resolve(DeleteCustomRewardService);

    await deleteCustomReward.execute({
      account_id,
      custom_reward_id,
    });

    return response.json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { custom_reward_id } = request.params;
    const {
      title,
      image_url,
      points,
      units_available,
      expiration_days,
      description,
    } = request.body;
    const { account_id } = request.user;

    const updateCustomReward = container.resolve(UpdateCustomRewardService);

    const custom_reward = await updateCustomReward.execute({
      custom_reward_id,
      title,
      image_url,
      points,
      account_id,
      units_available,
      expiration_days,
      description,
    });

    return response.json(classToClass(custom_reward));
  }
}
