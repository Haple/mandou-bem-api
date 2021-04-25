import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeCustomRewardsRepository from '../../repositories/fakes/FakeCustomRewardsRepository';
import CreateCustomRewardService from './CreateCustomRewardService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeCustomRewardsRepository: FakeCustomRewardsRepository;
let createCustomReward: CreateCustomRewardService;

describe('CreateCustomReward', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeCustomRewardsRepository = new FakeCustomRewardsRepository();

    createCustomReward = new CreateCustomRewardService(
      fakeCustomRewardsRepository,
    );
  });

  it('should be able to create a new custom reward', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const custom_reward = await createCustomReward.execute({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    expect(custom_reward).toHaveProperty('id');
  });

  it('should not be able to create a new custom reward with same title from another', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    await createCustomReward.execute({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      createCustomReward.execute({
        account_id: account.id,
        title: 'Netflix',
        image_url: 'https://google.com',
        points: 50,
        units_available: 10,
        expiration_days: 100,
        description: 'fake description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create custom reward with same title and different accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    await createCustomReward.execute({
      account_id: account1.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const custom_reward = await createCustomReward.execute({
      account_id: account2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    expect(custom_reward).toHaveProperty('id');
  });
});
