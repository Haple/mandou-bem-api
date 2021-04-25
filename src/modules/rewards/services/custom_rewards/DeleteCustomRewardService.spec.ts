import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeCustomRewardsRepository from '../../repositories/fakes/FakeCustomRewardsRepository';
import DeleteCustomRewardService from './DeleteCustomRewardService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeCustomRewardsRepository: FakeCustomRewardsRepository;
let deleteCustomReward: DeleteCustomRewardService;

describe('DeleteCustomReward', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeCustomRewardsRepository = new FakeCustomRewardsRepository();

    deleteCustomReward = new DeleteCustomRewardService(
      fakeCustomRewardsRepository,
    );
  });

  it('should be able to delete custom reward', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const custom_reward = await fakeCustomRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      deleteCustomReward.execute({
        account_id: account.id,
        custom_reward_id: custom_reward.id,
      }),
    ).resolves.not.toThrow(AppError);
  });

  it('should not be able to delete custom reward from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');

    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account2_custom_reward = await fakeCustomRewardsRepository.create({
      account_id: account2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      deleteCustomReward.execute({
        account_id: account1.id,
        custom_reward_id: account2_custom_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
