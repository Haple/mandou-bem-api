import { uuid } from 'uuidv4';
import CustomRewardRequest from '@modules/rewards/infra/typeorm/entities/CustomRewardRequest';
import { addDays, subDays } from 'date-fns';
import GiftCardRequest from '@modules/rewards/infra/typeorm/entities/GiftCardRequest';
import FakePDFProvider from '@shared/container/providers/PDFProvider/fakes/FakePDFProvider';
import FakeGiftCardRequestsRepository from '../../../repositories/fakes/FakeGiftCardRequestsRepository';
import FakeCustomRewardsRequestsRepository from '../../../repositories/fakes/FakeCustomRewardsRequestsRepository';
import RewardRequestsToPDFService from './RewardRequestsToPDFService';

let fakeGiftCardRequestsRepository: FakeGiftCardRequestsRepository;
let fakeCustomRewardsRequestsRepository: FakeCustomRewardsRequestsRepository;
let fakePDFProvider: FakePDFProvider;

let rewardRequestsToPDF: RewardRequestsToPDFService;

const custom_reward_request = {
  id: uuid(),
  custom_reward_id: 'fake-custom-reward-id',
  account_id: 'fake-account-id',
  user_id: 'fake-user-id',
  status: 'pending_approval',
  created_at: new Date(),
  user: {
    name: 'Fake Name',
    department_id: 'fake-department-id',
    position_id: 'fake-position-id',
    department: {
      department_name: 'Fake Department',
    },
    position: {
      position_name: 'Fake Position',
    },
  },
  custom_reward: {
    title: 'Fake Custom Reward Title',
  },
} as CustomRewardRequest;

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
    title: 'Fake Gift Card Title',
    provider: {
      name: 'Fake Provider Name',
    },
  },
  expire_at: addDays(new Date(), 365),
  updated_at: new Date(),
} as GiftCardRequest;

describe('RewardRequestsToPDF', () => {
  beforeEach(() => {
    fakeGiftCardRequestsRepository = new FakeGiftCardRequestsRepository();
    fakeCustomRewardsRequestsRepository = new FakeCustomRewardsRequestsRepository();
    fakePDFProvider = new FakePDFProvider();

    rewardRequestsToPDF = new RewardRequestsToPDFService(
      fakeGiftCardRequestsRepository,
      fakeCustomRewardsRequestsRepository,
      fakePDFProvider,
    );
  });

  it('should be able to generate custom reward requests PDF', async () => {
    await fakeCustomRewardsRequestsRepository.save(custom_reward_request);

    const rewards = await rewardRequestsToPDF.execute({
      reward_type: 'custom_reward',
      account_id: custom_reward_request.account_id,
      start_date: subDays(new Date(), 1),
      end_date: addDays(new Date(), 1),
      department_id: custom_reward_request.user.department_id,
      position_id: custom_reward_request.user.position_id,
    });

    expect(rewards).toBeTruthy();
  });

  it('should be able to genrate gift card requests PDF', async () => {
    await fakeGiftCardRequestsRepository.save(gift_card_request);

    const rewards = await rewardRequestsToPDF.execute({
      reward_type: 'gift_card',
      account_id: gift_card_request.user.account_id,
      start_date: subDays(new Date(), 1),
      end_date: addDays(new Date(), 1),
      department_id: gift_card_request.user.department_id,
      position_id: gift_card_request.user.position_id,
    });

    expect(rewards).toBeTruthy();
  });
});
