import { uuid } from 'uuidv4';
import { addDays, subDays } from 'date-fns';
import GiftCardRequest from '@modules/rewards/infra/typeorm/entities/GiftCardRequest';
import FakePDFProvider from '@shared/container/providers/PDFProvider/fakes/FakePDFProvider';
import FakeGiftCardRequestsRepository from '../../../repositories/fakes/FakeGiftCardRequestsRepository';
import GiftCardRequestsToPDFService from './GiftCardRequestsToPDFService';

let fakeGiftCardRequestsRepository: FakeGiftCardRequestsRepository;
let fakePDFProvider: FakePDFProvider;

let giftCardRequestsToPDF: GiftCardRequestsToPDFService;

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

describe('GiftCardRequestsToPDF', () => {
  beforeEach(() => {
    fakeGiftCardRequestsRepository = new FakeGiftCardRequestsRepository();
    fakePDFProvider = new FakePDFProvider();

    giftCardRequestsToPDF = new GiftCardRequestsToPDFService(
      fakeGiftCardRequestsRepository,
      fakePDFProvider,
    );
  });

  it('should be able to generate gift card requests PDF', async () => {
    await fakeGiftCardRequestsRepository.save(gift_card_request);

    const rewards = await giftCardRequestsToPDF.execute({
      provider_id: gift_card_request.user.account_id,
      start_date: subDays(new Date(), 1),
      end_date: addDays(new Date(), 1),
      gift_card_id: gift_card_request.gift_card_id,
      status: gift_card_request.status,
    });

    expect(rewards).toBeTruthy();
  });
});
