import User from '@modules/users/infra/typeorm/entities/User';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRecognitionPostsRepository from '../repositories/fakes/FakeRecognitionPostsRepository';
import ListRecognitionPostsService from './ListRecognitionPostsService';

let fakeRecognitionPostsRepository: FakeRecognitionPostsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listRecognitionPosts: ListRecognitionPostsService;
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
  from_user: {
    name: 'Fake Name',
    account_id: 'fake-account-id',
    department_id: 'fake-department-id',
    position_id: 'fake-position-id',
    department: {
      department_name: 'Fake Department',
    },
    position: {
      position_name: 'Fake Position',
    },
  } as User,
  to_user: {
    name: 'Fake Name 2',
    account_id: 'fake-account-id',
    department_id: 'fake-department-id',
    position_id: 'fake-position-id',
    department: {
      department_name: 'Fake Department',
    },
    position: {
      position_name: 'Fake Position',
    },
  } as User,
};

describe('ListRecognitionPosts', () => {
  beforeEach(() => {
    fakeRecognitionPostsRepository = new FakeRecognitionPostsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listRecognitionPosts = new ListRecognitionPostsService(
      fakeRecognitionPostsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list recognition posts', async () => {
    await fakeRecognitionPostsRepository.create(recognition_post_dto);
    await fakeRecognitionPostsRepository.create(recognition_post_dto);

    const recognition_posts = await listRecognitionPosts.execute({
      account_id: recognition_post_dto.account_id,
      page: 0,
      size: 2,
    });

    expect(recognition_posts.total).toBe(2);
  });
});
