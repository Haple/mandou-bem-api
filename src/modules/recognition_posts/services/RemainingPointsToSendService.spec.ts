import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRecognitionPostsRepository from '../repositories/fakes/FakeRecognitionPostsRepository';
import RemainingPointsToSendService from './RemainingPointsToSendService';

let fakeRecognitionPostsRepository: FakeRecognitionPostsRepository;
let fakeCacheProvider: FakeCacheProvider;
let remainingPointsToSend: RemainingPointsToSendService;
const recognition_post_dto = {
  account_id: 'fake-account-id',
  from_user_id: 'fake-from-user-id',
  to_user_id: 'fake-to-user-id',
  from_name: 'fake-from-name',
  to_name: 'fake-to-name',
  from_avatar: 'fake-from-avatar',
  to_avatar: 'fake-to-avatar',
  content: 'fake-content',
  recognition_points: 30,
};

describe('RemainingPointsToSend', () => {
  beforeEach(() => {
    fakeRecognitionPostsRepository = new FakeRecognitionPostsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    remainingPointsToSend = new RemainingPointsToSendService(
      fakeRecognitionPostsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to get remaining points to send', async () => {
    await fakeRecognitionPostsRepository.create(recognition_post_dto);
    await fakeRecognitionPostsRepository.create(recognition_post_dto);

    const { remaining_points } = await remainingPointsToSend.execute({
      user_id: recognition_post_dto.from_user_id,
    });

    expect(remaining_points).toBe(40);
  });

  it('should ignore points sent in the past months', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 6, 10, 12).getTime();
    });

    await fakeRecognitionPostsRepository.create({
      ...recognition_post_dto,
      recognition_points: 70,
    });
    await fakeRecognitionPostsRepository.create({
      ...recognition_post_dto,
      recognition_points: 20,
    });

    const { remaining_points } = await remainingPointsToSend.execute({
      user_id: 'fake-from-user-id',
    });

    expect(remaining_points).toBe(10);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    await fakeRecognitionPostsRepository.create({
      ...recognition_post_dto,
      recognition_points: 5,
    });

    await fakeCacheProvider.invalidatePrefix('remaining_points');

    const {
      remaining_points: points_next_month,
    } = await remainingPointsToSend.execute({
      user_id: 'fake-from-user-id',
    });

    expect(points_next_month).toBe(95);
  });
});
