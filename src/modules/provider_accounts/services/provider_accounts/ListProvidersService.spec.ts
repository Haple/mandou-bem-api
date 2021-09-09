import FakeProviderAccountsRepository from '../../repositories/fakes/FakeProviderAccountsRepository';
import ListProvidersService from './ListProvidersService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let createProviderAccount: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    createProviderAccount = new ListProvidersService(
      fakeProviderAccountsRepository,
    );
  });

  it('should be able to list providers', async () => {
    fakeProviderAccountsRepository.create({
      cnpj: 'fake-cnpj',
      company_name: 'fake provider company',
      email: 'fake@example.com',
      name: 'fake name',
      password: 'fake-pass',
    });
    const providers = await createProviderAccount.execute();

    expect(providers.length).toBe(1);
  });
});
