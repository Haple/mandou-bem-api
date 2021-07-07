import AppError from '@shared/errors/AppError';
import FakeGiftCardRequestsRepository from '../../repositories/fakes/FakeGiftCardRequestsRepository';
import GetGiftCardRequestService from './GetGiftCardRequestService';

let fakeGiftCardRequestsRepository: FakeGiftCardRequestsRepository;
let getGiftCardRequest: GetGiftCardRequestService;

describe('GetGiftCardRequest', () => {
  beforeEach(() => {
    fakeGiftCardRequestsRepository = new FakeGiftCardRequestsRepository();

    getGiftCardRequest = new GetGiftCardRequestService(
      fakeGiftCardRequestsRepository,
    );
  });

  it('should be able to get a gift card request', async () => {
    const reward_request = await fakeGiftCardRequestsRepository.create({
      gift_card_id: 'fake-custom-reward-id',
      expire_at: new Date(),
      user_id: 'fake-user-id',
      status: 'use_available',
    });

    Object.assign(reward_request, {
      gift_card: {
        provider_id: 'fake-provider-id',
      },
    });

    const custom_reward_request = await getGiftCardRequest.execute({
      gift_card_request_id: reward_request.id,
      provider_id: 'fake-provider-id',
    });

    expect(custom_reward_request).toHaveProperty('id');
  });

  it('should not be able to get a gift card request from another provider', async () => {
    const reward_request = await fakeGiftCardRequestsRepository.create({
      gift_card_id: 'fake-custom-reward-id',
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
      getGiftCardRequest.execute({
        provider_id: 'another-fake-provider-id',
        gift_card_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
