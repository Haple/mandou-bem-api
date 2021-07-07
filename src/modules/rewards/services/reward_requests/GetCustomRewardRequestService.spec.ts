import AppError from '@shared/errors/AppError';

import FakeCustomRewardsRequestsRepository from '../../repositories/fakes/FakeCustomRewardsRequestsRepository';
import GetCustomRewardRequestService from './GetCustomRewardRequestService';

let fakeRewardsRequestsRepository: FakeCustomRewardsRequestsRepository;
let getCustomRewardRequest: GetCustomRewardRequestService;

describe('GetCustomRewardRequest', () => {
  beforeEach(() => {
    fakeRewardsRequestsRepository = new FakeCustomRewardsRequestsRepository();

    getCustomRewardRequest = new GetCustomRewardRequestService(
      fakeRewardsRequestsRepository,
    );
  });

  it('should be able to get a custom reward request', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'pending_approval',
    });

    const custom_reward_request = await getCustomRewardRequest.execute({
      account_id: reward_request.account_id,
      custom_reward_request_id: reward_request.id,
    });

    expect(custom_reward_request).toHaveProperty('id');
  });

  it('should not be able to get a custom reward request from another account', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'pending_approval',
    });

    await expect(
      getCustomRewardRequest.execute({
        account_id: 'another-fake-account-id',
        custom_reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
