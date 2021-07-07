import AppError from '@shared/errors/AppError';

import FakeGiftCardRequestsRepository from '../../repositories/fakes/FakeGiftCardRequestsRepository';
import ValidateGiftCardService from './ValidateGiftCardService';

let fakGiftCardRequestsRepository: FakeGiftCardRequestsRepository;
let validateGiftCard: ValidateGiftCardService;

describe('ValidateGiftCard', () => {
  beforeEach(() => {
    fakGiftCardRequestsRepository = new FakeGiftCardRequestsRepository();

    validateGiftCard = new ValidateGiftCardService(
      fakGiftCardRequestsRepository,
    );
  });

  it('should be able to validate a gift card', async () => {
    const gift_card_request = await fakGiftCardRequestsRepository.create({
      gift_card_id: 'fake-gift-card-id',
      expire_at: new Date(),
      user_id: 'fake-user-id',
      status: 'use_available',
    });
    Object.assign(gift_card_request, {
      gift_card: {
        provider_id: 'fake-provider-id',
      },
    });

    const updated_reward_request = await validateGiftCard.execute({
      provider_id: 'fake-provider-id',
      gift_card_request_id: gift_card_request.id,
    });

    expect(updated_reward_request).toHaveProperty('id');
    expect(updated_reward_request.status).toBe('used');
  });

  it('should not be able to validate a gift card from another provider', async () => {
    const reward_request = await fakGiftCardRequestsRepository.create({
      gift_card_id: 'fake-gift-card-id',
      expire_at: new Date(),
      user_id: 'fake-user-id',
      status: 'use_available',
    });
    Object.assign(reward_request, {
      gift_card: {
        provider_id: 'fake-provider-id',
      },
    });

    await expect(
      validateGiftCard.execute({
        provider_id: 'another-fake-provider-id',
        gift_card_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to validate a gift card already used', async () => {
    const gift_card_request = await fakGiftCardRequestsRepository.create({
      gift_card_id: 'fake-gift-card-id',
      expire_at: new Date(),
      user_id: 'fake-user-id',
      status: 'used',
    });
    Object.assign(gift_card_request, {
      gift_card: {
        provider_id: 'fake-provider-id',
      },
    });

    await expect(
      validateGiftCard.execute({
        provider_id: 'fake-provider-id',
        gift_card_request_id: gift_card_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
