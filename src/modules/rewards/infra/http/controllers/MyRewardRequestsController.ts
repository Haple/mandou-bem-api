import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListMyRewardRequestsService from '@modules/rewards/services/reports/user/ListMyRewardRequestsService';

export default class RewardRequestsReportController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const reward_type = (request.query.reward_type as unknown) as
      | 'gift_card'
      | 'custom_reward';
    const start_date = (request.query.start_date as unknown) as Date;
    const end_date = (request.query.end_date as unknown) as Date;
    const page = (request.query.page as unknown) as number;
    const size = (request.query.size as unknown) as number;
    const status = (request.query.status as unknown) as string;

    const listMyRewardRequests = container.resolve(ListMyRewardRequestsService);

    const my_reward_requests = await listMyRewardRequests.execute({
      reward_type,
      user_id,
      start_date,
      end_date,
      page,
      size,
      status,
    });

    return response.json(classToClass(my_reward_requests));
  }
}
