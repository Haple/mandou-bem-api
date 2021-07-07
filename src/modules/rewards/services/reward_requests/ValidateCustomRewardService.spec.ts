import AppError from '@shared/errors/AppError';

import FakeCustomRewardsRequestsRepository from '../../repositories/fakes/FakeCustomRewardsRequestsRepository';
import ValidateCustomRewardService from './ValidateCustomRewardService';

let fakeRewardsRequestsRepository: FakeCustomRewardsRequestsRepository;
let validateCustomReward: ValidateCustomRewardService;

describe('ValidateCustomReward', () => {
  beforeEach(() => {
    fakeRewardsRequestsRepository = new FakeCustomRewardsRequestsRepository();

    validateCustomReward = new ValidateCustomRewardService(
      fakeRewardsRequestsRepository,
    );
  });

  it('should be able to validate a custom reward', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'use_available',
    });

    const updated_reward_request = await validateCustomReward.execute({
      account_id: reward_request.account_id,
      custom_reward_request_id: reward_request.id,
    });

    expect(updated_reward_request).toHaveProperty('id');
    expect(updated_reward_request.status).toBe('used');
  });

  it('should not be able to validate a custom reward from another account', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'use_available',
    });

    await expect(
      validateCustomReward.execute({
        account_id: 'another-fake-account-id',
        custom_reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to validate a reward already used', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'used',
    });

    await expect(
      validateCustomReward.execute({
        account_id: reward_request.account_id,
        custom_reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
