import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeCatalogRewardsRepository from '../repositories/fakes/FakeCatalogRewardsRepository';
import CreateCatalogRewardService from './CreateCatalogRewardService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeCatalogRewardRepository: FakeCatalogRewardsRepository;
let createCatalogReward: CreateCatalogRewardService;

describe('CreateCatalogReward', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeCatalogRewardRepository = new FakeCatalogRewardsRepository();

    createCatalogReward = new CreateCatalogRewardService(
      fakeCatalogRewardRepository,
    );
  });

  it('should be able to create a new catalog reward', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const catalog_reward = await createCatalogReward.execute({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    expect(catalog_reward).toHaveProperty('id');
  });

  it('should not be able to create a new catalog reward with same title from another', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    await createCatalogReward.execute({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await expect(
      createCatalogReward.execute({
        account_id: account.id,
        title: 'Netflix',
        image_url: 'https://google.com',
        points: 50,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create catalog reward with same title and different accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    await createCatalogReward.execute({
      account_id: account1.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    const catalog_reward = await createCatalogReward.execute({
      account_id: account2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    expect(catalog_reward).toHaveProperty('id');
  });
});
