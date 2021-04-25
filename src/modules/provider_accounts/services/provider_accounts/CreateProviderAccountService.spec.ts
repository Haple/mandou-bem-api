import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeProviderAccountsRepository from '../../repositories/fakes/FakeProviderAccountsRepository';
import CreateProviderAccountService from './CreateProviderAccountService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let fakeHashProvider: FakeHashProvider;
let createProviderAccount: CreateProviderAccountService;

describe('CreateProviderAccount', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    fakeHashProvider = new FakeHashProvider();
    createProviderAccount = new CreateProviderAccountService(
      fakeProviderAccountsRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new provider account', async () => {
    const provider_account = await createProviderAccount.execute({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(provider_account).toHaveProperty('id');
  });

  it('should not be able to create a new provider account with already used e-mail', async () => {
    await createProviderAccount.execute({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      createProviderAccount.execute({
        company_name: 'Aleph Labs',
        cnpj: '00.000.000/0000-00',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
