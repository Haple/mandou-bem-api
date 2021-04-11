import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeCatalogRewardsRepository from '../../repositories/fakes/FakeCatalogRewardsRepository';
import UpdateCatalogRewardService from './UpdateCatalogRewardService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeCatalogRewardsRepository: FakeCatalogRewardsRepository;
let updateCatalogReward: UpdateCatalogRewardService;

describe('UpdateCatalogReward', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeCatalogRewardsRepository = new FakeCatalogRewardsRepository();

    updateCatalogReward = new UpdateCatalogRewardService(
      fakeCatalogRewardsRepository,
    );
  });

  it('should be able to update a catalog reward', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await updateCatalogReward.execute({
      catalog_reward_id: catalog_reward.id,
      account_id: account.id,
      title: 'Updated Netflix',
      image_url: 'https://updated.google.com',
      points: 40,
    });

    const updated_catalog_reward = await fakeCatalogRewardsRepository.findById(
      catalog_reward.id,
    );

    expect(updated_catalog_reward).toBeDefined();
    expect(updated_catalog_reward?.title).toBe('Updated Netflix');
    expect(updated_catalog_reward?.image_url).toBe(
      'https://updated.google.com',
    );
    expect(updated_catalog_reward?.points).toBe(40);
  });

  it('should be able to update a catalog reward without change title', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await updateCatalogReward.execute({
      catalog_reward_id: catalog_reward.id,
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://updated.google.com',
      points: 40,
    });

    const updated_catalog_reward = await fakeCatalogRewardsRepository.findById(
      catalog_reward.id,
    );

    expect(updated_catalog_reward).toBeDefined();
    expect(updated_catalog_reward?.title).toBe('Netflix');
    expect(updated_catalog_reward?.image_url).toBe(
      'https://updated.google.com',
    );
    expect(updated_catalog_reward?.points).toBe(40);
  });

  it('should not be able to update a catalog reward with same title from another', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const catalog_reward_1 = await fakeCatalogRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    const catalog_reward_2 = await fakeCatalogRewardsRepository.create({
      account_id: account.id,
      title: 'Google Play',
      image_url: 'https://google.com',
      points: 50,
    });

    await expect(
      updateCatalogReward.execute({
        catalog_reward_id: catalog_reward_2.id,
        account_id: account.id,
        title: catalog_reward_1.title,
        image_url: 'https://google.com',
        points: 50,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update catalog reward with same title and different accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const catalog_reward_1 = await fakeCatalogRewardsRepository.create({
      account_id: account1.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    const catalog_reward_2 = await fakeCatalogRewardsRepository.create({
      account_id: account2.id,
      title: 'Google Play',
      image_url: 'https://google.com',
      points: 50,
    });

    const updated_catalog_reward = await updateCatalogReward.execute({
      catalog_reward_id: catalog_reward_2.id,
      account_id: account2.id,
      title: catalog_reward_1.title,
      image_url: 'https://google.com',
      points: 50,
    });

    expect(updated_catalog_reward).toBeDefined();
    expect(updated_catalog_reward?.title).toBe(catalog_reward_1.title);
  });

  it('should not be able to update catalog reward from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');

    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account2_catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await expect(
      updateCatalogReward.execute({
        catalog_reward_id: account2_catalog_reward.id,
        account_id: account1.id,
        title: 'Google Play',
        image_url: 'https://google.com',
        points: 50,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
