import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeCatalogRewardsRepository from '../repositories/fakes/FakeCatalogRewardsRepository';
import DeleteCatalogRewardService from './DeleteCatalogRewardService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeCatalogRewardsRepository: FakeCatalogRewardsRepository;
let deleteCatalogReward: DeleteCatalogRewardService;

describe('DeleteCatalogReward', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeCatalogRewardsRepository = new FakeCatalogRewardsRepository();

    deleteCatalogReward = new DeleteCatalogRewardService(
      fakeCatalogRewardsRepository,
    );
  });

  it('should be able to delete catalog reward', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await expect(
      deleteCatalogReward.execute({
        account_id: account.id,
        catalog_reward_id: catalog_reward.id,
      }),
    ).resolves.not.toThrow(AppError);
  });

  it('should not be able to delete catalog reward from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');

    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account2_catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await expect(
      deleteCatalogReward.execute({
        account_id: account1.id,
        catalog_reward_id: account2_catalog_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
