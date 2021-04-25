import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCustomRewardRequestService from '@modules/rewards/services/custom_reward_requests/CreateCustomRewardRequestService';
import DeliverCustomRewardService from '@modules/rewards/services/custom_reward_requests/DeliverCustomRewardService';
import CustomRewardRequestsRepository from '../../typeorm/repositories/CustomRewardRequestsRepository';

export default class RewardRequestsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { custom_reward_id } = request.body;
    const { account_id, id: user_id } = request.user;

    const createRewardRequest = container.resolve(
      CreateCustomRewardRequestService,
    );

    const reward_request = await createRewardRequest.execute({
      custom_reward_id,
      user_id,
      account_id,
    });

    return response.json(classToClass(reward_request));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const status = request.query.status as string;
    const { account_id } = request.user;

    const rewardRequestsRepository = container.resolve(
      CustomRewardRequestsRepository,
    );

    const custom_rewards = await rewardRequestsRepository.findAllFromAccount(
      account_id,
      status,
    );

    return response.json(classToClass(custom_rewards));
  }

  public async deliver(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { reward_request_id } = request.params;
    const { account_id } = request.user;

    const deliverReward = container.resolve(DeliverCustomRewardService);

    const reward_request_updated = await deliverReward.execute({
      reward_request_id,
      account_id,
    });

    return response.json(classToClass(reward_request_updated));
  }
}
