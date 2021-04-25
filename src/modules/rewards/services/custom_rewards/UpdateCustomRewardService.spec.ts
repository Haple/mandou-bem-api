import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeCustomRewardsRepository from '../../repositories/fakes/FakeCustomRewardsRepository';
import UpdateCustomRewardService from './UpdateCustomRewardService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeCustomRewardsRepository: FakeCustomRewardsRepository;
let updateCustomReward: UpdateCustomRewardService;

describe('UpdateCustomReward', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeCustomRewardsRepository = new FakeCustomRewardsRepository();

    updateCustomReward = new UpdateCustomRewardService(
      fakeCustomRewardsRepository,
    );
  });

  it('should be able to update a custom reward', async () => {
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

    await updateCustomReward.execute({
      custom_reward_id: custom_reward.id,
      account_id: account.id,
      title: 'Updated Netflix',
      image_url: 'https://updated.google.com',
      points: 40,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const updated_custom_reward = await fakeCustomRewardsRepository.findById(
      custom_reward.id,
    );

    expect(updated_custom_reward).toBeDefined();
    expect(updated_custom_reward?.title).toBe('Updated Netflix');
    expect(updated_custom_reward?.image_url).toBe(
      'https://updated.google.com',
    );
    expect(updated_custom_reward?.points).toBe(40);
  });

  it('should be able to update a custom reward without change title', async () => {
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

    await updateCustomReward.execute({
      custom_reward_id: custom_reward.id,
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://updated.google.com',
      points: 40,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const updated_custom_reward = await fakeCustomRewardsRepository.findById(
      custom_reward.id,
    );

    expect(updated_custom_reward).toBeDefined();
    expect(updated_custom_reward?.title).toBe('Netflix');
    expect(updated_custom_reward?.image_url).toBe(
      'https://updated.google.com',
    );
    expect(updated_custom_reward?.points).toBe(40);
  });

  it('should not be able to update a custom reward with same title from another', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const custom_reward_1 = await fakeCustomRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const custom_reward_2 = await fakeCustomRewardsRepository.create({
      account_id: account.id,
      title: 'Google Play',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      updateCustomReward.execute({
        custom_reward_id: custom_reward_2.id,
        account_id: account.id,
        title: custom_reward_1.title,
        image_url: 'https://google.com',
        points: 50,
        units_available: 10,
        expiration_days: 100,
        description: 'fake description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update custom reward with same title and different accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const custom_reward_1 = await fakeCustomRewardsRepository.create({
      account_id: account1.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const custom_reward_2 = await fakeCustomRewardsRepository.create({
      account_id: account2.id,
      title: 'Google Play',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const updated_custom_reward = await updateCustomReward.execute({
      custom_reward_id: custom_reward_2.id,
      account_id: account2.id,
      title: custom_reward_1.title,
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    expect(updated_custom_reward).toBeDefined();
    expect(updated_custom_reward?.title).toBe(custom_reward_1.title);
  });

  it('should not be able to update custom reward from another account', async () => {
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
      updateCustomReward.execute({
        custom_reward_id: account2_custom_reward.id,
        account_id: account1.id,
        title: 'Google Play',
        image_url: 'https://google.com',
        points: 50,
        units_available: 10,
        expiration_days: 100,
        description: 'fake description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
