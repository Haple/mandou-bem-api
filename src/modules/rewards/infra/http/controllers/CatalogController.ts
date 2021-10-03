import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListCatalogRewardsService from '@modules/rewards/services/catalog/ListCatalogRewardsService';
import AccountGiftCardSwitchService from '@modules/rewards/services/catalog/AccountGiftCardSwitchService';

export default class CatalogController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;

    const listCatalogRewards = container.resolve(ListCatalogRewardsService);

    const rewards = await listCatalogRewards.execute({ account_id });

    return response.json(classToClass(rewards));
  }

  public async switchGiftCard(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { gift_card_id, status } = request.body;

    const { account_id } = request.user;

    const accountGiftCardSwitch = container.resolve(
      AccountGiftCardSwitchService,
    );

    await accountGiftCardSwitch.execute({
      account_id,
      gift_card_id,
      status,
    });

    return response.json();
  }
}
