import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeProviderAccountsRepository from '../../repositories/fakes/FakeProviderAccountsRepository';
import FakeProviderTokensRepository from '../../repositories/fakes/FakeProviderTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let fakeProviderTokensRepository: FakeProviderTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    fakeProviderTokensRepository = new FakeProviderTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeProviderAccountsRepository,
      fakeProviderTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const providerToken = await fakeProviderTokensRepository.generate(
      provider.id,
    );
    await fakeProviderTokensRepository.save({
      ...providerToken,
      provider_account: provider,
    });
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '123123',
      token: providerToken.token,
    });

    const updatedProvider = await fakeProviderAccountsRepository.findByEmail(
      provider.email,
    );
    expect(generateHash).toBeCalledWith('123123');
    expect(updatedProvider?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const providerToken = await fakeProviderTokensRepository.generate(
      provider.id,
    );
    await fakeProviderTokensRepository.save({
      ...providerToken,
      provider_account: provider,
    });
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '123123',
        token: providerToken.token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
