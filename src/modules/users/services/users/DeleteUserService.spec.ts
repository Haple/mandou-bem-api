import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import DeleteUserService from './DeleteUserService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeUsersRepository: FakeUsersRepository;
let deleteUser: DeleteUserService;

describe('DeleteUser', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    deleteUser = new DeleteUserService(fakeUsersRepository);
  });

  it('should be able to delete user', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      account_id: account.id,
      position_id: 'fake-position-id',
      department_id: 'fake-department-id'
    });

    await expect(
      deleteUser.execute({
        account_id: account.id,
        user_id: user.id,
      }),
    ).resolves.not.toThrow(AppError);
  });

  it('should not be able to delete user from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');

    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account2User = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
      account_id: account2.id,
      position_id: 'fake-position-id',
      department_id: 'fake-department-id'
    });

    await expect(
      deleteUser.execute({
        account_id: account1.id,
        user_id: account2User.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
