import { injectable, inject } from 'tsyringe';

import ICustomRewardsRepository from '@modules/rewards/repositories/ICustomRewardsRepository';
import IAccountGiftCardsRepository from '@modules/rewards/repositories/IAccountGiftCardsRepository';
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
  enabled: boolean;
}

@injectable()
class ListCatalogRewardsService {
  constructor(
    @inject('GiftCardsRepository')
    private giftCardsRepository: IGiftCardsRepository,
    @inject('CustomRewardsRepository')
    private customRewardsRepository: ICustomRewardsRepository,
    @inject('AccountGiftCardsRepository')
    private accountGiftCardsRepository: IAccountGiftCardsRepository,
  ) {}

  public async execute({ account_id }: IRequest): Promise<IResponse[]> {
    const custom_rewards = await this.customRewardsRepository.findAllFromAccount(
      account_id,
    );
    const gift_cards = await this.giftCardsRepository.findAll();
    const account_gift_cards = await this.accountGiftCardsRepository.findByAccount(
      account_id,
    );

    const rewards = [
      ...custom_rewards.map<IResponse>(custom_reward => ({
        ...custom_reward,
        reward_type: 'custom-reward',
        company_name: custom_reward.account.company_name,
        enabled: true,
      })),
      ...gift_cards.map<IResponse>(gift_card => ({
        ...gift_card,
        reward_type: 'gift-card',
        company_name: gift_card.provider.company_name,
        enabled: !!account_gift_cards.find(
          agc => agc.gift_card_id === gift_card.id,
        ),
      })),
    ];
    return rewards;
  }
}

export default ListCatalogRewardsService;
