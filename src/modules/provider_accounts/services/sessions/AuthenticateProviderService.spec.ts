import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateProviderService from './AuthenticateProviderService';
import FakeProviderAccountsRepository from '../../repositories/fakes/FakeProviderAccountsRepository';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateProvider: AuthenticateProviderService;

describe('AuthenticateProvider', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateProvider = new AuthenticateProviderService(
      fakeProviderAccountsRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate provider', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await authenticateProvider.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.provider).toEqual(provider);
  });

  it('should not be able to authenticate provider with non existing provider', async () => {
    await expect(
      authenticateProvider.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate provider with wrong password', async () => {
    await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      authenticateProvider.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
