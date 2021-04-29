import { injectable, inject } from 'tsyringe';

import ICustomRewardsRepository from '@modules/rewards/repositories/ICustomRewardsRepository';
import IGiftCardsRepository from '../../repositories/IGiftCardsRepository';

interface IRequest {
  account_id: string;
}

interface IResponse {
  id: string;
  title: string;
  image_url: string;
  points: number;
  company_name: string;
  units_available: number;
  expiration_days: number;
  description: string;
  reward_type: 'gift-card' | 'custom-reward';
}

@injectable()
class ListCatalogRewardsService {
  constructor(
    @inject('GiftCardsRepository')
    private giftCardsRepository: IGiftCardsRepository,
    @inject('CustomRewardsRepository')
    private customRewardsRepository: ICustomRewardsRepository,
  ) {}

  public async execute({ account_id }: IRequest): Promise<IResponse[]> {
    const custom_rewards = await this.customRewardsRepository.findAllFromAccount(
      account_id,
    );
    const gift_cards = await this.giftCardsRepository.findAll();

    const rewards = [
      ...custom_rewards.map<IResponse>(custom_reward => ({
        ...custom_reward,
        reward_type: 'custom-reward',
        company_name: custom_reward.account.company_name,
      })),
      ...gift_cards.map<IResponse>(gift_card => ({
        ...gift_card,
        reward_type: 'gift-card',
        company_name: gift_card.provider.company_name,
      })),
    ];
    return rewards;
  }
}

export default ListCatalogRewardsService;
