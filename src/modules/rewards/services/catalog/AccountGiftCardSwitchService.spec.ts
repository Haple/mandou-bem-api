import FakeAccountGiftCardsRepository from '../../repositories/fakes/FakeAccountGiftCardsRepository';
import AccountGiftCardSwitchService from './AccountGiftCardSwitchService';

let fakeAccountGiftCardsRepository: FakeAccountGiftCardsRepository;
let accountGiftCardSwitch: AccountGiftCardSwitchService;

describe('AccountGiftCardSwitch', () => {
  beforeEach(() => {
    fakeAccountGiftCardsRepository = new FakeAccountGiftCardsRepository();

    accountGiftCardSwitch = new AccountGiftCardSwitchService(
      fakeAccountGiftCardsRepository,
    );
  });

  it('should be able to enable account gift card', async () => {
    await accountGiftCardSwitch.execute({
      account_id: 'fake-account',
      gift_card_id: 'fake-gift-card',
      status: true,
    });

    const response = await fakeAccountGiftCardsRepository.findById(
      'fake-account',
      'fake-gift-card',
    );

    expect(response).toBeTruthy();
  });

  it('should be able to disable account gift card', async () => {
    await fakeAccountGiftCardsRepository.create(
      'fake-account',
      'fake-gift-card',
    );

    await accountGiftCardSwitch.execute({
      account_id: 'fake-account',
      gift_card_id: 'fake-gift-card',
      status: false,
    });

    const response = await fakeAccountGiftCardsRepository.findById(
      'fake-account',
      'fake-gift-card',
    );

    expect(response).toBeFalsy();
  });

  it('should be able to enable account gift card already enabled', async () => {
    await fakeAccountGiftCardsRepository.create(
      'fake-account',
      'fake-gift-card',
    );

    await accountGiftCardSwitch.execute({
      account_id: 'fake-account',
      gift_card_id: 'fake-gift-card',
      status: true,
    });

    const response = await fakeAccountGiftCardsRepository.findById(
      'fake-account',
      'fake-gift-card',
    );

    expect(response).toBeTruthy();
  });

  it('should be able to disable account gift card already disabled', async () => {
    await accountGiftCardSwitch.execute({
      account_id: 'fake-account',
      gift_card_id: 'fake-gift-card',
      status: false,
    });

    const response = await fakeAccountGiftCardsRepository.findById(
      'fake-account',
      'fake-gift-card',
    );

    expect(response).toBeFalsy();
  });
});
