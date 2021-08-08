import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import FakeRecognitionPostsRepository from '../repositories/fakes/FakeRecognitionPostsRepository';
import CreateCommentService from './CreateCommentService';

let fakeRecognitionPostsRepository: FakeRecognitionPostsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createComment: CreateCommentService;

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

describe('CreateComment', () => {
  beforeEach(() => {
    fakeRecognitionPostsRepository = new FakeRecognitionPostsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createComment = new CreateCommentService(
      fakeRecognitionPostsRepository,
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a comment on recognition post', async () => {
    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    const post = await fakeRecognitionPostsRepository.create(
      recognition_post_dto,
    );

    const recognition_post = await createComment.execute({
      user_id: user.id,
      recognition_post_id: post.id.toString(),
      content: 'Thanks for your work!',
    });

    expect(recognition_post.comments.length).toBe(1);
  });
});
