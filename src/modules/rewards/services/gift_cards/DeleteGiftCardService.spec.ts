import AppError from '@shared/errors/AppError';

import FakeProviderAccountsRepository from '@modules/provider_accounts/repositories/fakes/FakeProviderAccountsRepository';
import FakeGiftCardsRepository from '../../repositories/fakes/FakeGiftCardsRepository';
import DeleteGiftCardService from './DeleteGiftCardService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let fakeGiftCardsRepository: FakeGiftCardsRepository;
let deleteGiftCard: DeleteGiftCardService;

describe('DeleteGiftCard', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    fakeGiftCardsRepository = new FakeGiftCardsRepository();

    deleteGiftCard = new DeleteGiftCardService(fakeGiftCardsRepository);
  });

  it('should be able to delete gift card', async () => {
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

    await expect(
      deleteGiftCard.execute({
        provider_id: provider.id,
        gift_card_id: gift_card.id,
      }),
    ).resolves.not.toThrow(AppError);
  });

  it('should not be able to delete gift card from another account', async () => {
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

    const provider2_gift_card = await fakeGiftCardsRepository.create({
      provider_id: provider2.id,
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      deleteGiftCard.execute({
        provider_id: provider1.id,
        gift_card_id: provider2_gift_card.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
