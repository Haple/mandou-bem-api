import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeProviderAccountsRepository from '../../repositories/fakes/FakeProviderAccountsRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeProviderAccountsRepository,
      fakeHashProvider,
    );
  });

  it('should be able update the profile', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedProvider = await updateProfile.execute({
      provider_id: provider.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      company_name: 'New Company',
      cnpj: '11.111.111/1111-11',
    });

    expect(updatedProvider.name).toBe('John Trê');
    expect(updatedProvider.email).toBe('johntre@example.com');
    expect(updatedProvider.company_name).toBe('New Company');
    expect(updatedProvider.cnpj).toBe('11.111.111/1111-11');
  });

  it('should not be able update the profile from non-existing provider', async () => {
    await expect(
      updateProfile.execute({
        provider_id: 'non-existing-user-id',
        name: 'John Trê',
        email: 'johntre@example.com',
        company_name: 'New Company',
        cnpj: '11.111.111/1111-11',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        provider_id: provider.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        company_name: 'Aleph Labs',
        cnpj: '00.000.000/0000-00',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      provider_id: provider.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      old_password: '123456',
      password: '123123',
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        provider_id: provider.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        password: '123123',
        company_name: 'Aleph Labs',
        cnpj: '00.000.000/0000-00',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        provider_id: provider.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
        company_name: 'Aleph Labs',
        cnpj: '00.000.000/0000-00',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
