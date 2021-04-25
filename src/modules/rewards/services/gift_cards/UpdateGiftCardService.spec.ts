import AppError from '@shared/errors/AppError';

import FakeProviderAccountsRepository from '@modules/provider_accounts/repositories/fakes/FakeProviderAccountsRepository';
import FakeGiftCardsRepository from '../../repositories/fakes/FakeGiftCardsRepository';
import UpdateGiftCardService from './UpdateGiftCardService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let fakeGiftCardsRepository: FakeGiftCardsRepository;
let updateGiftCard: UpdateGiftCardService;

describe('UpdateGiftCard', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    fakeGiftCardsRepository = new FakeGiftCardsRepository();

    updateGiftCard = new UpdateGiftCardService(fakeGiftCardsRepository);
  });

  it('should be able to update a gift card', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const gift_card = await fakeGiftCardsRepository.create({
      provider_id: provider.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await updateGiftCard.execute({
      gift_card_id: gift_card.id,
      provider_id: provider.id,
      title: 'Updated Netflix',
      image_url: 'https://updated.google.com',
      points: 40,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const updated_gift_card = await fakeGiftCardsRepository.findById(
      gift_card.id,
    );

    expect(updated_gift_card).toBeDefined();
    expect(updated_gift_card?.title).toBe('Updated Netflix');
    expect(updated_gift_card?.image_url).toBe('https://updated.google.com');
    expect(updated_gift_card?.points).toBe(40);
  });

  it('should be able to update a gift card without change title', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const gift_card = await fakeGiftCardsRepository.create({
      provider_id: provider.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await updateGiftCard.execute({
      gift_card_id: gift_card.id,
      provider_id: provider.id,
      title: 'Netflix',
      image_url: 'https://updated.google.com',
      points: 40,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const updated_gift_card = await fakeGiftCardsRepository.findById(
      gift_card.id,
    );

    expect(updated_gift_card).toBeDefined();
    expect(updated_gift_card?.title).toBe('Netflix');
    expect(updated_gift_card?.image_url).toBe('https://updated.google.com');
    expect(updated_gift_card?.points).toBe(40);
  });

  it('should not be able to update a gift card with same title from another', async () => {
    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const gift_card_1 = await fakeGiftCardsRepository.create({
      provider_id: provider.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const gift_card_2 = await fakeGiftCardsRepository.create({
      provider_id: provider.id,
      title: 'Google Play',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      updateGiftCard.execute({
        gift_card_id: gift_card_2.id,
        provider_id: provider.id,
        title: gift_card_1.title,
        image_url: 'https://google.com',
        points: 50,
        units_available: 10,
        expiration_days: 100,
        description: 'fake description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update gift card with same title and different accounts', async () => {
    const provider1 = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const provider2 = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs 2',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const gift_card_1 = await fakeGiftCardsRepository.create({
      provider_id: provider1.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const gift_card_2 = await fakeGiftCardsRepository.create({
      provider_id: provider2.id,
      title: 'Google Play',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const updated_gift_card = await updateGiftCard.execute({
      gift_card_id: gift_card_2.id,
      provider_id: provider2.id,
      title: gift_card_1.title,
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    expect(updated_gift_card).toBeDefined();
    expect(updated_gift_card?.title).toBe(gift_card_1.title);
  });

  it('should not be able to update gift card from another account', async () => {
    const provider1 = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const provider2 = await fakeProviderAccountsRepository.create({
      company_name: 'Fake Labs 2',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const account2_gift_card = await fakeGiftCardsRepository.create({
      provider_id: provider2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      updateGiftCard.execute({
        gift_card_id: account2_gift_card.id,
        provider_id: provider1.id,
        title: 'Google Play',
        image_url: 'https://google.com',
        points: 50,
        units_available: 10,
        expiration_days: 100,
        description: 'fake description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
