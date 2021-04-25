import AppError from '@shared/errors/AppError';

import FakeCustomRewardsRequestsRepository from '../../repositories/fakes/FakeCustomRewardsRequestsRepository';
import DeliverCustomRewardService from './DeliverCustomRewardService';

let fakeRewardsRequestsRepository: FakeCustomRewardsRequestsRepository;
let deliverCustomReward: DeliverCustomRewardService;

describe('DeliverCustomReward', () => {
  beforeEach(() => {
    fakeRewardsRequestsRepository = new FakeCustomRewardsRequestsRepository();

    deliverCustomReward = new DeliverCustomRewardService(
      fakeRewardsRequestsRepository,
    );
  });

  it('should be able to deliver a custom reward', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'CREATED',
    });

    const reward_request_updated = await deliverCustomReward.execute({
      account_id: reward_request.account_id,
      reward_request_id: reward_request.id,
    });

    expect(reward_request_updated).toHaveProperty('id');
    expect(reward_request_updated.status).toBe('DELIVERED');
  });

  it('should not be able to deliver a custom reward from another account', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'CREATED',
    });

    await expect(
      deliverCustomReward.execute({
        account_id: 'another-fake-account-id',
        reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to deliver a reward already delivered', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'DELIVERED',
    });

    await expect(
      deliverCustomReward.execute({
        account_id: reward_request.account_id,
        reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
