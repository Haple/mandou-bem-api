import AppError from '@shared/errors/AppError';

import FakeProviderAccountsRepository from '../../repositories/fakes/FakeProviderAccountsRepository';
import ShowProfileService from './ShowProfileService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();

    showProfile = new ShowProfileService(fakeProviderAccountsRepository);
  });

  it('should be able to show the profile', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      provider_id: provider.id,
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });

  it('should not be able to show the profile from non-existing provider', async () => {
    await expect(
      showProfile.execute({
        provider_id: 'non-existing-provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
