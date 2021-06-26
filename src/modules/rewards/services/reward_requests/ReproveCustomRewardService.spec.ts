import FakeCustomRewardsRepository from '@modules/rewards/repositories/fakes/FakeCustomRewardsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import FakeCustomRewardsRequestsRepository from '../../repositories/fakes/FakeCustomRewardsRequestsRepository';
import ReproveCustomRewardService from './ReproveCustomRewardService';

let fakeRewardsRequestsRepository: FakeCustomRewardsRequestsRepository;
let fakeCustomRewardsRepository: FakeCustomRewardsRepository;
let fakeUsersRepository: FakeUsersRepository;
let reproveCustomReward: ReproveCustomRewardService;

describe('ReproveCustomReward', () => {
  beforeEach(() => {
    fakeRewardsRequestsRepository = new FakeCustomRewardsRequestsRepository();
    fakeCustomRewardsRepository = new FakeCustomRewardsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    reproveCustomReward = new ReproveCustomRewardService(
      fakeRewardsRequestsRepository,
      fakeCustomRewardsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to reprove a custom reward', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'pending_approval',
    });
    Object.assign(reward_request, {
      user: { id: 'fake-user-id', recognition_points: 100 },
    });
    Object.assign(reward_request, {
      custom_reward: {
        id: 'fake-custom-reward-id',
        units_available: 10,
        points: 50,
      },
    });

    const updated_reward_request = await reproveCustomReward.execute({
      account_id: reward_request.account_id,
      custom_reward_request_id: reward_request.id,
      reprove_reason: 'test reason',
    });

    const updated_user = await fakeUsersRepository.findById(
      reward_request.user_id,
    );
    const updated_custom_reward = await fakeCustomRewardsRepository.findById(
      reward_request.custom_reward_id,
    );

    expect(updated_reward_request).toHaveProperty('id');
    expect(updated_reward_request.status).toBe('reproved');
    expect(updated_reward_request.reprove_reason).toBe('test reason');
    expect(updated_user?.recognition_points).toBe(150);
    expect(updated_custom_reward?.units_available).toBe(11);
  });

  it('should not be able to reprove a custom reward from another account', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'pending_approval',
    });

    await expect(
      reproveCustomReward.execute({
        account_id: 'another-fake-account-id',
        custom_reward_request_id: reward_request.id,
        reprove_reason: 'test reason',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reprove a reward already reproved', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'use_available',
    });

    await expect(
      reproveCustomReward.execute({
        account_id: reward_request.account_id,
        custom_reward_request_id: reward_request.id,
        reprove_reason: 'test reason',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
