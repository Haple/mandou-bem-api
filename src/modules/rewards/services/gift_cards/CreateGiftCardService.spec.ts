import AppError from '@shared/errors/AppError';

import FakeProviderAccountsRepository from '@modules/provider_accounts/repositories/fakes/FakeProviderAccountsRepository';
import FakeGiftCardsRepository from '../../repositories/fakes/FakeGiftCardsRepository';
import CreateGiftCardService from './CreateGiftCardService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let fakeGiftCardsRepository: FakeGiftCardsRepository;
let createGiftCard: CreateGiftCardService;

describe('CreateGiftCard', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    fakeGiftCardsRepository = new FakeGiftCardsRepository();

    createGiftCard = new CreateGiftCardService(fakeGiftCardsRepository);
  });

  it('should be able to create a gift card', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const gift_card = await createGiftCard.execute({
      provider_id: provider.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    expect(gift_card).toHaveProperty('id');
  });

  it('should not be able to create a new gift card with same title from another', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await createGiftCard.execute({
      provider_id: provider.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      createGiftCard.execute({
        provider_id: provider.id,
        title: 'Netflix',
        image_url: 'https://google.com',
        points: 50,
        units_available: 10,
        expiration_days: 100,
        description: 'fake description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create gift card with same title and different accounts', async () => {
    const account1 = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs ',
      cnpj: '00.000.000/0000-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const account2 = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs 2',
      cnpj: '00.000.000/0000-02',
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
    });

    await createGiftCard.execute({
      provider_id: account1.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const gift_card = await createGiftCard.execute({
      provider_id: account2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    expect(gift_card).toHaveProperty('id');
  });
});
