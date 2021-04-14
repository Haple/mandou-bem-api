import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeDepartmentsRepository from '@modules/users/repositories/fakes/FakeDepartmentsRepository';
import FakePositionsRepository from '@modules/users/repositories/fakes/FakePositionsRepository';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateUserService from './UpdateUserService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeDepartmentsRepository: FakeDepartmentsRepository;
let fakePositionsRepository: FakePositionsRepository;
let fakeUsersRepository: FakeUsersRepository;
let updateUser: UpdateUserService;

describe('UpdatePosition', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakePositionsRepository = new FakePositionsRepository();
    fakeDepartmentsRepository = new FakeDepartmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    updateUser = new UpdateUserService(
      fakePositionsRepository,
      fakeDepartmentsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to update a user', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const position = await fakePositionsRepository.create({
      account_id: account.id,
      points: 100,
      position_name: 'Manager',
    });
    const department = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'Marketing',
    });
    const new_position = await fakePositionsRepository.create({
      account_id: account.id,
      points: 100,
      position_name: 'New Manager',
    });
    const new_department = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'New Marketing',
    });
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account.id,
      position_id: position.id,
      department_id: department.id,
      password: '123',
    });

    const updated_user = await updateUser.execute({
      user_id: user.id,
      account_id: account.id,
      position_id: new_position.id,
      department_id: new_department.id,
    });

    expect(updated_user).toHaveProperty('id');
    expect(updated_user?.position).toBe(new_position);
    expect(updated_user?.department).toBe(new_department);
  });

  it('should be able to update a user without change anything', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const position = await fakePositionsRepository.create({
      account_id: account.id,
      points: 100,
      position_name: 'Manager',
    });
    const department = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'Marketing',
    });
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account.id,
      position_id: position.id,
      department_id: department.id,
      password: '123',
    });

    const updated_user = await updateUser.execute({
      user_id: user.id,
      account_id: account.id,
      position_id: position.id,
      department_id: department.id,
    });

    expect(updated_user).toHaveProperty('id');
    expect(updated_user?.position).toBe(position);
    expect(updated_user?.department).toBe(department);
  });

  it('should not be able to update user from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account1_user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account1.id,
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
      password: '123',
    });

    await expect(
      updateUser.execute({
        user_id: account1_user.id,
        account_id: account2.id,
        position_id: 'updated-fake-position-id',
        department_id: 'updated-fake-department-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user with unknown position', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const department = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'Marketing',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account.id,
      position_id: 'fake-position-id',
      department_id: department.id,
      password: '123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        account_id: account.id,
        position_id: 'unknown-position-id',
        department_id: department.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user with unknown department', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const position = await fakePositionsRepository.create({
      account_id: account.id,
      points: 100,
      position_name: 'Manager',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account.id,
      position_id: position.id,
      department_id: 'fake-department-id',
      password: '123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        account_id: account.id,
        position_id: position.id,
        department_id: 'unknown-department-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user with position from another account', async () => {
    const account_1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account_1_position = await fakePositionsRepository.create({
      account_id: account_1.id,
      points: 100,
      position_name: 'Manager',
    });

    const account_2 = await fakeAccountsRepository.create('Fake Labs 2');
    const department = await fakeDepartmentsRepository.create({
      account_id: account_2.id,
      department_name: 'Marketing',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account_2.id,
      position_id: 'fake-position-id',
      department_id: department.id,
      password: '123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        account_id: account_2.id,
        position_id: account_1_position.id,
        department_id: department.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user with department from another account', async () => {
    const account_1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account_1_department = await fakeDepartmentsRepository.create({
      account_id: account_1.id,
      department_name: 'Marketing',
    });

    const account_2 = await fakeAccountsRepository.create('Fake Labs 2');
    const position = await fakePositionsRepository.create({
      account_id: account_2.id,
      points: 100,
      position_name: 'Manager',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account_2.id,
      position_id: position.id,
      department_id: 'fake-department-id',
      password: '123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        account_id: account_2.id,
        position_id: position.id,
        department_id: account_1_department.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
