import { uuid } from 'uuidv4';
import { addDays, subDays } from 'date-fns';
import GiftCardRequest from '@modules/rewards/infra/typeorm/entities/GiftCardRequest';
import FakeGiftCardRequestsRepository from '../../../repositories/fakes/FakeGiftCardRequestsRepository';
import ListGiftCardRequestsService from './ListGiftCardRequestsService';

let fakeGiftCardRequestsRepository: FakeGiftCardRequestsRepository;
let listGiftCardRequests: ListGiftCardRequestsService;

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

describe('ListGiftCardRequests', () => {
  beforeEach(() => {
    fakeGiftCardRequestsRepository = new FakeGiftCardRequestsRepository();

    listGiftCardRequests = new ListGiftCardRequestsService(
      fakeGiftCardRequestsRepository,
    );
  });

  it('should be able to list gift card requests', async () => {
    await fakeGiftCardRequestsRepository.save(gift_card_request);

    const rewards = await listGiftCardRequests.execute({
      provider_id: gift_card_request.gift_card.provider_id,
      start_date: subDays(new Date(), 1),
      end_date: addDays(new Date(), 1),
      page: 0,
      size: 1,
      status: gift_card_request.status,
      gift_card_id: gift_card_request.gift_card_id,
    });

    expect(rewards.total).toBe(1);
  });
});
