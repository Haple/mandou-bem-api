import { uuid } from 'uuidv4';
import { addDays } from 'date-fns';
import GiftCardRequest from '@modules/rewards/infra/typeorm/entities/GiftCardRequest';
import FakeGiftCardRequestsRepository from '../../../repositories/fakes/FakeGiftCardRequestsRepository';
import GiftCardSummaryService from './GiftCardSummaryService';

let fakeGiftCardRequestsRepository: FakeGiftCardRequestsRepository;
let giftCardSummary: GiftCardSummaryService;

const gift_card_request = {
  id: uuid(),
  gift_card_id: 'fake-gift-card-id',
  user_id: 'fake-user-id',
  status: 'use_available',
  created_at: new Date(),
  user: {
    name: 'Fake Name',
    account_id: 'fake-account-id',
    department_id: 'fake-department-id',
    position_id: 'fake-position-id',
    department: {
      department_name: 'Fake Department',
    },
    position: {
      position_name: 'Fake Position',
    },
  },
  gift_card: {
    id: 'fake-gift-card-id',
    provider_id: 'fake-provider-id',
    title: 'Fake Gift Card Title',
    provider: {
      id: 'fake-provider-id',
      name: 'Fake Provider Name',
    },
  },
  expire_at: addDays(new Date(), 365),
  updated_at: new Date(),
} as GiftCardRequest;

describe('GiftCardSummary', () => {
  beforeEach(() => {
    fakeGiftCardRequestsRepository = new FakeGiftCardRequestsRepository();

    giftCardSummary = new GiftCardSummaryService(
      fakeGiftCardRequestsRepository,
    );
  });

  it('should be able to get gift cards summary', async () => {
    await fakeGiftCardRequestsRepository.save(gift_card_request);

    const rewards = await giftCardSummary.execute({
      provider_id: gift_card_request.gift_card.provider_id,
    });

    expect(rewards).toBeTruthy();
  });
});
