import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeRecognitionPostsRepository from '../repositories/fakes/FakeRecognitionPostsRepository';
import CreateRecognitionPostService from './CreateRecognitionPostService';
import RemainingPointsToSendService from './RemainingPointsToSendService';

let remainingPointsToSendService: RemainingPointsToSendService;

let fakeRecognitionPostsRepository: FakeRecognitionPostsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createRecognitionPost: CreateRecognitionPostService;

describe('CreateRecognitionPost', () => {
  beforeEach(() => {
    fakeRecognitionPostsRepository = new FakeRecognitionPostsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    remainingPointsToSendService = new RemainingPointsToSendService(
      fakeRecognitionPostsRepository,
      fakeCacheProvider,
    );

    createRecognitionPost = new CreateRecognitionPostService(
      remainingPointsToSendService,
      fakeRecognitionPostsRepository,
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a recognition post', async () => {
    const from_user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
    });

    const to_user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      name: 'Jessica Hill',
      email: 'jessicahill@corp.com',
      password: '1234',
    });

    const recognition_post = await createRecognitionPost.execute({
      from_user_id: from_user.id,
      to_user_id: to_user.id,
      recognition_points: 30,
      content: 'Thanks for your work!',
    });

    const to_user_updated = await fakeUsersRepository.findById(to_user.id);

    expect(recognition_post).toHaveProperty('id');
    expect(to_user_updated?.recognition_points).toBe(30);
  });

  it('should not be able to create a recognition post with invalid points quantity', async () => {
    const from_user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
    });

    const to_user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      name: 'Jessica Hill',
      email: 'jessicahill@corp.com',
      password: '1234',
    });

    const { remaining_points } = await remainingPointsToSendService.execute({
      user_id: from_user.id,
    });

    await expect(
      createRecognitionPost.execute({
        from_user_id: from_user.id,
        to_user_id: to_user.id,
        recognition_points: remaining_points + 1,
        content: 'Thanks for your work!',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a recognition post to yourself', async () => {
    const cheater_user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      name: 'Cheater',
      email: 'cheater@corp.com',
      password: '1234',
    });

    await expect(
      createRecognitionPost.execute({
        from_user_id: cheater_user.id,
        to_user_id: cheater_user.id,
        recognition_points: 5,
        content: 'I am trying to cheat!',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a recognition post to a user from another account', async () => {
    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id-1',
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
    });

    const user_from_another_account = await fakeUsersRepository.create({
      account_id: 'fake-account-id-2',
      name: 'Jessica Hill',
      email: 'jessicahill@corp.com',
      password: '1234',
    });

    await expect(
      createRecognitionPost.execute({
        from_user_id: user.id,
        to_user_id: user_from_another_account.id,
        recognition_points: 100,
        content: 'Thanks for your work!',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
