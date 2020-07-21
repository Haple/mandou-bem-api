import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCatalogRewardsRepository from '../../repositories/fakes/FakeCatalogRewardsRepository';
import FakeRewardsRequestsRepository from '../../repositories/fakes/FakeRewardsRequestsRepository';
import CreateRewardRequestService from './CreateRewardRequestService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeCatalogRewardsRepository: FakeCatalogRewardsRepository;
let fakeRewardsRequestsRepository: FakeRewardsRequestsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createRewardRequest: CreateRewardRequestService;

describe('CreateRewardRequest', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeCatalogRewardsRepository = new FakeCatalogRewardsRepository();
    fakeRewardsRequestsRepository = new FakeRewardsRequestsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createRewardRequest = new CreateRewardRequestService(
      fakeRewardsRequestsRepository,
      fakeCatalogRewardsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a new reward request', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const user = await fakeUsersRepository.create({
      account_id: account.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
    });
    user.recognition_points = 200;
    await fakeUsersRepository.save(user);

    const catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    const catalog_reward_request = await createRewardRequest.execute({
      account_id: account.id,
      user_id: user.id,
      catalog_reward_id: catalog_reward.id,
    });

    const updated_user = await fakeUsersRepository.findById(user.id);

    expect(catalog_reward_request).toHaveProperty('id');
    expect(updated_user?.recognition_points).toBe(150);
  });

  it('should not be able to request reward from another account', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const user = await fakeUsersRepository.create({
      account_id: account.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
    });
    user.recognition_points = 200;
    await fakeUsersRepository.save(user);

    const catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await expect(
      createRewardRequest.execute({
        account_id: account.id,
        user_id: user.id,
        catalog_reward_id: catalog_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request reward with insufficient recognition points', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const user = await fakeUsersRepository.create({
      account_id: account.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
    });
    user.recognition_points = 10;
    await fakeUsersRepository.save(user);

    const catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await expect(
      createRewardRequest.execute({
        account_id: account.id,
        user_id: user.id,
        catalog_reward_id: catalog_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request reward with user from another account', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const user = await fakeUsersRepository.create({
      account_id: account2.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
    });
    user.recognition_points = 200;
    await fakeUsersRepository.save(user);

    const catalog_reward = await fakeCatalogRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
    });

    await expect(
      createRewardRequest.execute({
        account_id: account.id,
        user_id: user.id,
        catalog_reward_id: catalog_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
