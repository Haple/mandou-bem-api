import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakePositionsRepository from '../../repositories/fakes/FakePositionsRepository';
import UpdatePositionService from './UpdatePositionService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakePositionsRepository: FakePositionsRepository;
let updatePosition: UpdatePositionService;

describe('UpdatePosition', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakePositionsRepository = new FakePositionsRepository();

    updatePosition = new UpdatePositionService(fakePositionsRepository);
  });

  it('should be able to update a position', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const position = await fakePositionsRepository.create({
      account_id: account.id,
      position_name: 'Manager',
      points: 200,
    });

    await updatePosition.execute({
      position_id: position.id,
      account_id: account.id,
      position_name: 'Senior Manager',
      points: 400,
    });

    const updated_position = await fakePositionsRepository.findById(
      position.id,
    );

    expect(updated_position).toBeDefined();
    expect(updated_position?.position_name).toBe('Senior Manager');
    expect(updated_position?.points).toBe(400);
  });

  it('should be able to update a position without change name', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const position = await fakePositionsRepository.create({
      account_id: account.id,
      position_name: 'Manager',
      points: 200,
    });

    await updatePosition.execute({
      position_id: position.id,
      account_id: account.id,
      position_name: 'Manager',
      points: 400,
    });

    const updated_position = await fakePositionsRepository.findById(
      position.id,
    );

    expect(updated_position).toBeDefined();
    expect(updated_position?.position_name).toBe('Manager');
    expect(updated_position?.points).toBe(400);
  });

  it('should not be able to update a position with same name from another', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const position_1 = await fakePositionsRepository.create({
      account_id: account.id,
      position_name: 'Manager',
      points: 200,
    });

    const position_2 = await fakePositionsRepository.create({
      account_id: account.id,
      position_name: 'Seller',
      points: 100,
    });

    await expect(
      updatePosition.execute({
        position_id: position_2.id,
        account_id: account.id,
        position_name: position_1.position_name,
        points: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update position with same name and different accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const position_1 = await fakePositionsRepository.create({
      account_id: account1.id,
      position_name: 'Manager',
      points: 200,
    });

    const position_2 = await fakePositionsRepository.create({
      account_id: account2.id,
      position_name: 'Seller',
      points: 100,
    });

    const updated_position = await updatePosition.execute({
      position_id: position_2.id,
      account_id: account2.id,
      position_name: position_1.position_name,
      points: 200,
    });

    expect(updated_position).toBeDefined();
    expect(updated_position?.position_name).toBe(position_1.position_name);
  });

  it('should not be able to update catalog reward from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account2_position = await fakePositionsRepository.create({
      account_id: account2.id,
      position_name: 'Manager',
      points: 200,
    });

    await expect(
      updatePosition.execute({
        position_id: account2_position.id,
        account_id: account1.id,
        position_name: 'Manager Senior',
        points: 400,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
