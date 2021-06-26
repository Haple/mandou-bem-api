import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCustomRewardRequestService from '@modules/rewards/services/reward_requests/CreateCustomRewardRequestService';
import ApproveCustomRewardService from '@modules/rewards/services/reward_requests/ApproveCustomRewardService';
import ReproveCustomRewardService from '@modules/rewards/services/reward_requests/ReproveCustomRewardService';
import CustomRewardRequestsRepository from '../../typeorm/repositories/CustomRewardRequestsRepository';

export default class CustomRewardRequestsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { custom_reward_id } = request.body;
    const { account_id, id: user_id } = request.user;

    const createCustomRewardRequest = container.resolve(
      CreateCustomRewardRequestService,
    );

    const custom_reward_request = await createCustomRewardRequest.execute({
      custom_reward_id,
      user_id,
      account_id,
    });

    return response.json(classToClass(custom_reward_request));
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

  public async approve(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { custom_reward_request_id } = request.params;
    const { account_id } = request.user;

    const approveCustomReward = container.resolve(ApproveCustomRewardService);

    const reward_request_updated = await approveCustomReward.execute({
      custom_reward_request_id,
      account_id,
    });

    return response.json(classToClass(reward_request_updated));
  }

  public async reprove(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { custom_reward_request_id } = request.params;
    const { reprove_reason } = request.body;
    const { account_id } = request.user;

    const reproveCustomReward = container.resolve(ReproveCustomRewardService);

    const reward_request_updated = await reproveCustomReward.execute({
      custom_reward_request_id,
      account_id,
      reprove_reason,
    });

    return response.json(classToClass(reward_request_updated));
  }
}
