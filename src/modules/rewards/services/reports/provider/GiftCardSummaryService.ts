import { injectable, inject } from 'tsyringe';

import ICountByWeekDTO from '@modules/rewards/dtos/ICountByWeekDTO';
import ICountByGiftCardDTO from '@modules/rewards/dtos/ICountByGiftCardDTO';
import IGiftCardRequestsRepository from '../../../repositories/IGiftCardRequestsRepository';

interface IRequest {
  provider_id: string;
}

interface IResponse {
  weeklyRequests: ICountByWeekDTO[];
  weeklyValidations: ICountByWeekDTO[];
  lastRequests: ICountByGiftCardDTO[];
}

@injectable()
class ListGiftCardRequestsService {
  constructor(
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
  ) {}

  public async execute({ provider_id }: IRequest): Promise<IResponse> {
    const weeklyRequests = this.giftCardRequestsRepository.countWeeklyRequests(
      provider_id,
    );

    const weeklyValidations = this.giftCardRequestsRepository.countWeeklyValidations(
      provider_id,
    );

    const lastRequests = this.giftCardRequestsRepository.countLastGiftCardRequests(
      provider_id,
    );

    const allPromises = await Promise.all([
      weeklyRequests,
      weeklyValidations,
      lastRequests,
    ]);

    return {
      weeklyRequests: allPromises[0].map(item => ({
        count: item.count,
        week_date: item.week_date,
      })),
      weeklyValidations: allPromises[1].map(item => ({
        count: item.count,
        week_date: item.week_date,
      })),
      lastRequests: allPromises[2].map(item => ({
        count: item.count,
        title: item.title,
      })),
    };
  }
}

export default ListGiftCardRequestsService;
