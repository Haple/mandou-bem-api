import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeMailProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const account = await fakeAccountsRepository.create('Fake Labs');

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account.id,
    });

    expect(user).toHaveProperty('id');
    expect(sendMail).toBeCalled();
  });

  it('should not be able to create a new user with same email from another', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const account = await fakeAccountsRepository.create('Fake Labs');

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account.id,
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        account_id: account.id,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(sendMail).toBeCalledTimes(1);
  });
});
