import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeAccountsRepository from '../../repositories/fakes/FakeAccountsRepository';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import CreateAccountService from './CreateAccountService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createAccount: CreateAccountService;

describe('CreateAccount', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createAccount = new CreateAccountService(
      fakeUsersRepository,
      fakeAccountsRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new account', async () => {
    const account = await createAccount.execute({
      company_name: 'Aleph Labs',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(account).toHaveProperty('id');
  });

  it('should not be able to create a new account with already used e-mail', async () => {
    await createAccount.execute({
      company_name: 'Aleph Labs',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      createAccount.execute({
        company_name: 'Aleph Labs',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
