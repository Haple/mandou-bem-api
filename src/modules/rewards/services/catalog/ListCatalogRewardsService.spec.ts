import FakeCustomRewardsRepository from '@modules/rewards/repositories/fakes/FakeCustomRewardsRepository';
import FakeGiftCardsRepository from '../../repositories/fakes/FakeGiftCardsRepository';
import ListCatalogRewardsService from './ListCatalogRewardsService';

let fakeCustomRewardsRepository: FakeCustomRewardsRepository;
let fakeGiftCardsRepository: FakeGiftCardsRepository;

let listCatalogRewards: ListCatalogRewardsService;

describe('ListCatalogRewards', () => {
  beforeEach(() => {
    fakeCustomRewardsRepository = new FakeCustomRewardsRepository();
    fakeGiftCardsRepository = new FakeGiftCardsRepository();

    listCatalogRewards = new ListCatalogRewardsService(
      fakeGiftCardsRepository,
      fakeCustomRewardsRepository,
    );
  });

  it('should be able to list rewards', async () => {
    await fakeGiftCardsRepository.create({
      provider_id: 'fake-provider-1',
      title: 'gift-card1',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await fakeCustomRewardsRepository.create({
      account_id: 'fake-account-1',
      title: 'custom-reward1',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await fakeCustomRewardsRepository.create({
      account_id: 'fake-account-1',
      title: 'custom-reward2',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const returned_rewards = await listCatalogRewards.execute({
      account_id: 'fake-account-1',
    });

    expect(returned_rewards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'gift-card1',
          reward_type: 'gift-card',
        }),
        expect.objectContaining({
          title: 'custom-reward1',
          reward_type: 'custom-reward',
        }),
        expect.objectContaining({
          title: 'custom-reward2',
          reward_type: 'custom-reward',
        }),
      ]),
    );
  });
});
