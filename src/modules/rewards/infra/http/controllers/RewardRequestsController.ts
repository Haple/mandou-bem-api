import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateRewardRequestService from '@modules/rewards/services/reward_requests/CreateRewardRequestService';
import RewardRequestsRepository from '../../typeorm/repositories/RewardRequestsRepository';

export default class RewardRequestsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { catalog_reward_id } = request.body;
    const { account_id, id: user_id } = request.user;

    const createRewardRequest = container.resolve(CreateRewardRequestService);

    const reward_request = await createRewardRequest.execute({
      catalog_reward_id,
      user_id,
      account_id,
    });

    return response.json(classToClass(reward_request));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;

    const rewardRequestsRepository = container.resolve(
      RewardRequestsRepository,
    );

    const catalog_rewards = await rewardRequestsRepository.findAllFromAccount(
      account_id,
    );

    return response.json(classToClass(catalog_rewards));
  }
}
