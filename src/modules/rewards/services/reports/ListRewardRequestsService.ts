import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@modules/enps/dtos/IPaginationDTO';
import IGiftCardRequestsRepository from '../../repositories/IGiftCardRequestsRepository';
import ICustomRewardRequestsRepository from '../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  reward_type: 'gift_card' | 'custom_reward';
  account_id: string;
  start_date: Date;
  end_date: Date;
  page: number;
  size: number;
  department_id?: string;
  position_id?: string;
}

interface IResponse {
  id: string;
  created_at: Date;
  user_name: string;
  reward_title: string;
  status: string;
  position_name: string;
  department_name: string;
  position_id: string;
  department_id: string;
  provider_name?: string;
}

@injectable()
class ListRewardRequestsService {
  constructor(
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
    @inject('CustomRewardRequestsRepository')
    private customRewardRequestsRepository: ICustomRewardRequestsRepository,
  ) {}

  public async execute({
    reward_type,
    account_id,
    start_date,
    end_date,
    page,
    size,
    department_id,
    position_id,
  }: IRequest): Promise<IPaginationDTO<IResponse>> {
    if (reward_type === 'gift_card') {
      return this.getGiftCardRequests({
        account_id,
        start_date,
        end_date,
        page,
        size,
        department_id,
        position_id,
      });
    }

    return this.getCustomRewardsRequests({
      account_id,
      start_date,
      end_date,
      page,
      size,
      department_id,
      position_id,
    });
  }

  private async getGiftCardRequests({
    account_id,
    start_date,
    end_date,
    page,
    size,
    department_id,
    position_id,
  }: Omit<IRequest, 'reward_type'>): Promise<IPaginationDTO<IResponse>> {
    const {
      result,
      total,
    } = await this.giftCardRequestsRepository.findByAccountAndDatePaginated(
      account_id,
      start_date,
      end_date,
      page,
      size,
      department_id,
      position_id,
    );

    const gift_card_requests = result.map(
      r =>
        ({
          id: r.id,
          created_at: r.created_at,
          user_name: r.user.name,
          reward_title: r.gift_card.title,
          status: r.status,
          department_id: r.user.department.id,
          department_name: r.user.department.department_name,
          position_id: r.user.position.id,
          position_name: r.user.position.position_name,
          provider_name: r.gift_card.provider.company_name,
        } as IResponse),
    );

    return {
      result: gift_card_requests,
      total,
    };
  }

  private async getCustomRewardsRequests({
    account_id,
    start_date,
    end_date,
    page,
    size,
    department_id,
    position_id,
  }: Omit<IRequest, 'reward_type'>): Promise<IPaginationDTO<IResponse>> {
    const {
      result,
      total,
    } = await this.customRewardRequestsRepository.findByAccountAndDatePaginated(
      account_id,
      start_date,
      end_date,
      page,
      size,
      department_id,
      position_id,
    );

    const custom_reward_requests = result.map(
      r =>
        ({
          id: r.id,
          created_at: r.created_at,
          user_name: r.user.name,
          reward_title: r.custom_reward.title,
          status: r.status,
          department_id: r.user.department.id,
          department_name: r.user.department.department_name,
          position_id: r.user.position.id,
          position_name: r.user.position.position_name,
        } as IResponse),
    );

    return {
      result: custom_reward_requests,
      total,
    };
  }
}

export default ListRewardRequestsService;
