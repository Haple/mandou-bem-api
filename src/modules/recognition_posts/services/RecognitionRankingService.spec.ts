import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRecognitionPostsRepository from '../repositories/fakes/FakeRecognitionPostsRepository';
import RecognitionRankingService from './RecognitionRankingService';

let fakeRecognitionPostsRepository: FakeRecognitionPostsRepository;
let fakeCacheProvider: FakeCacheProvider;
let recognitionRanking: RecognitionRankingService;
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

describe('RecognitionRanking', () => {
  beforeEach(() => {
    fakeRecognitionPostsRepository = new FakeRecognitionPostsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    recognitionRanking = new RecognitionRankingService(
      fakeRecognitionPostsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list recognition ranking', async () => {
    await fakeRecognitionPostsRepository.create({
      ...recognition_post_dto,
      to_user_id: 'fake-1',
      to_name: 'Fake 1',
      recognition_points: 10,
    });
    await fakeRecognitionPostsRepository.create({
      ...recognition_post_dto,
      to_user_id: 'fake-1',
      to_name: 'Fake 1',
      recognition_points: 10,
    });
    await fakeRecognitionPostsRepository.create({
      ...recognition_post_dto,
      to_user_id: 'fake-2',
      to_name: 'Fake 2',
      recognition_points: 5,
    });

    const ranking = await recognitionRanking.execute({
      account_id: recognition_post_dto.account_id,
    });

    expect(ranking.length).toBe(2);
    expect(ranking[0].recognition_points).toBe(20);
    expect(ranking[1].recognition_points).toBe(5);
  });
});
