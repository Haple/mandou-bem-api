import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListRewardRequestsService from '@modules/rewards/services/reports/admin/ListRewardRequestsService';
import RewardRequestsToPDFService from '@modules/rewards/services/reports/admin/RewardRequestsToPDFService';

export default class RewardRequestsReportController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;
    const reward_type = (request.query.reward_type as unknown) as
      | 'gift_card'
      | 'custom_reward';
    const start_date = (request.query.start_date as unknown) as Date;
    const end_date = (request.query.end_date as unknown) as Date;
    const page = (request.query.page as unknown) as number;
    const size = (request.query.size as unknown) as number;
    const department_id = (request.query.department_id as unknown) as string;
    const position_id = (request.query.position_id as unknown) as string;
    const provider_id = (request.query.provider_id as unknown) as string;
    const status = (request.query.status as unknown) as string;

    const listRewardRequests = container.resolve(ListRewardRequestsService);

    const custom_rewards = await listRewardRequests.execute({
      reward_type,
      account_id,
      start_date,
      end_date,
      page,
      size,
      department_id,
      position_id,
      provider_id,
      status,
    });

    return response.json(classToClass(custom_rewards));
  }

  public async downloadPDF(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { account_id } = request.user;
    const reward_type = (request.query.reward_type as unknown) as
      | 'gift_card'
      | 'custom_reward';
    const start_date = (request.query.start_date as unknown) as Date;
    const end_date = (request.query.end_date as unknown) as Date;
    const department_id = (request.query.department_id as unknown) as string;
    const position_id = (request.query.position_id as unknown) as string;
    const provider_id = (request.query.provider_id as unknown) as string;
    const status = (request.query.status as unknown) as string;

    const rewardRequestsToPDF = container.resolve(RewardRequestsToPDFService);

    const pdf = await rewardRequestsToPDF.execute({
      reward_type,
      account_id,
      start_date,
      end_date,
      department_id,
      position_id,
      provider_id,
      status,
    });

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length,
    });
    response.send(pdf);
  }
}
