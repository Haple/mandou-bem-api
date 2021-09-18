import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@modules/enps/dtos/IPaginationDTO';
import IGiftCardRequestsRepository from '../../../repositories/IGiftCardRequestsRepository';

interface IRequest {
  provider_id: string;
  start_date: Date;
  end_date: Date;
  page: number;
  size: number;
  gift_card_id?: string;
  status?: string;
}

interface IResponse {
  id: string;
  created_at: Date;
  user_name: string;
  reward_title: string;
  reward_id: string;
  status: string;
}

@injectable()
class ListGiftCardRequestsService {
  constructor(
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
  ) {}

  public async execute({
    provider_id,
    start_date,
    end_date,
    page,
    size,
    gift_card_id,
    status,
  }: IRequest): Promise<IPaginationDTO<IResponse>> {
    const {
      result,
      total,
    } = await this.giftCardRequestsRepository.findByProviderAndDatePaginated(
      provider_id,
      start_date,
      end_date,
      page,
      size,
      gift_card_id,
      status,
    );

    const gift_card_requests = result.map(
      r =>
        ({
          id: r.id,
          created_at: r.created_at,
          user_name: r.user.name,
          reward_title: r.gift_card.title,
          reward_id: r.gift_card_id,
          status: r.status,
        } as IResponse),
    );

    return {
      result: gift_card_requests,
      total,
    };
  }
}

export default ListGiftCardRequestsService;
