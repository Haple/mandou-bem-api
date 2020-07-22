import AppError from '@shared/errors/AppError';

import FakeRewardsRequestsRepository from '../../repositories/fakes/FakeRewardsRequestsRepository';
import DeliverRewardService from './DeliverRewardService';

let fakeRewardsRequestsRepository: FakeRewardsRequestsRepository;
let deliverReward: DeliverRewardService;

describe('DeliverReward', () => {
  beforeEach(() => {
    fakeRewardsRequestsRepository = new FakeRewardsRequestsRepository();

    deliverReward = new DeliverRewardService(fakeRewardsRequestsRepository);
  });

  it('should be able to deliver a reward', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      catalog_reward_id: 'fake-catalog-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'CREATED',
    });

    const reward_request_updated = await deliverReward.execute({
      account_id: reward_request.account_id,
      reward_request_id: reward_request.id,
    });

    expect(reward_request_updated).toHaveProperty('id');
    expect(reward_request_updated.status).toBe('DELIVERED');
  });

  it('should not be able to deliver a reward from another account', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      catalog_reward_id: 'fake-catalog-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'CREATED',
    });

    await expect(
      deliverReward.execute({
        account_id: 'another-fake-account-id',
        reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to deliver a reward already delivered', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      catalog_reward_id: 'fake-catalog-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'DELIVERED',
    });

    await expect(
      deliverReward.execute({
        account_id: reward_request.account_id,
        reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
