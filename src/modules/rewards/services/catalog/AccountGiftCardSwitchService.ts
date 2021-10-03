import { injectable, inject } from 'tsyringe';

import IAccountGiftCardsRepository from '@modules/rewards/repositories/IAccountGiftCardsRepository';

interface IRequest {
  account_id: string;
  gift_card_id: string;
  status: boolean;
}

@injectable()
class AccountGiftCardSwitchService {
  constructor(
    @inject('AccountGiftCardsRepository')
    private accountGiftCardsRepository: IAccountGiftCardsRepository,
  ) {}

  public async execute({
    account_id,
    gift_card_id,
    status,
  }: IRequest): Promise<void> {
    const account_gift_card = await this.accountGiftCardsRepository.findById(
      account_id,
      gift_card_id,
    );

    if (status === true && !account_gift_card) {
      await this.accountGiftCardsRepository.create(account_id, gift_card_id);
    } else if (status === false && account_gift_card) {
      await this.accountGiftCardsRepository.remove(account_gift_card);
    }
  }
}

export default AccountGiftCardSwitchService;
