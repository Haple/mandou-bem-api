import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCustomRewardsRepository from '../../repositories/fakes/FakeCustomRewardsRepository';
import FakeCustomRewardsRequestsRepository from '../../repositories/fakes/FakeCustomRewardsRequestsRepository';
import CreateCustomRewardRequestService from './CreateCustomRewardRequestService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeCustomRewardsRepository: FakeCustomRewardsRepository;
let fakeCustomRewardRequestsRepository: FakeCustomRewardsRequestsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createCustomRewardRequest: CreateCustomRewardRequestService;

describe('CreateCustomRewardRequest', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeCustomRewardsRepository = new FakeCustomRewardsRepository();
    fakeCustomRewardRequestsRepository = new FakeCustomRewardsRequestsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createCustomRewardRequest = new CreateCustomRewardRequestService(
      fakeCustomRewardRequestsRepository,
      fakeCustomRewardsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a new custom reward request', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const user = await fakeUsersRepository.create({
      account_id: account.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 200;
    await fakeUsersRepository.save(user);

    const custom_reward = await fakeCustomRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const custom_reward_request = await createCustomRewardRequest.execute({
      account_id: account.id,
      user_id: user.id,
      custom_reward_id: custom_reward.id,
    });

    const updated_user = await fakeUsersRepository.findById(user.id);
    const updated_custom_reward = await fakeCustomRewardsRepository.findById(
      custom_reward.id,
    );

    expect(custom_reward_request).toHaveProperty('id');
    expect(custom_reward_request.status).toBe('pending_approval');
    expect(updated_user?.recognition_points).toBe(150);
    expect(updated_custom_reward?.units_available).toBe(9);
  });

  it('should not be able to request custom reward from another account', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const user = await fakeUsersRepository.create({
      account_id: account.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 200;
    await fakeUsersRepository.save(user);

    const custom_reward = await fakeCustomRewardsRepository.create({
      account_id: account2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      createCustomRewardRequest.execute({
        account_id: account.id,
        user_id: user.id,
        custom_reward_id: custom_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request custom reward with insufficient recognition points', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const user = await fakeUsersRepository.create({
      account_id: account.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 10;
    await fakeUsersRepository.save(user);

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
      createCustomRewardRequest.execute({
        account_id: account.id,
        user_id: user.id,
        custom_reward_id: custom_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request custom reward with no units available', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const user = await fakeUsersRepository.create({
      account_id: account.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 10;
    await fakeUsersRepository.save(user);

    const custom_reward = await fakeCustomRewardsRepository.create({
      account_id: account.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 0,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      createCustomRewardRequest.execute({
        account_id: account.id,
        user_id: user.id,
        custom_reward_id: custom_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request custom reward with user from another account', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const user = await fakeUsersRepository.create({
      account_id: account2.id,
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 200;
    await fakeUsersRepository.save(user);

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
      createCustomRewardRequest.execute({
        account_id: account.id,
        user_id: user.id,
        custom_reward_id: custom_reward.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
