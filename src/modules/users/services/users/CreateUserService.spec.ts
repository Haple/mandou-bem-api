import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeDepartmentsRepository from '@modules/users/repositories/fakes/FakeDepartmentsRepository';
import FakePositionsRepository from '@modules/users/repositories/fakes/FakePositionsRepository';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeDepartmentsRepository: FakeDepartmentsRepository;
let fakePositionsRepository: FakePositionsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeDepartmentsRepository = new FakeDepartmentsRepository();
    fakePositionsRepository = new FakePositionsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(
      fakePositionsRepository,
      fakeDepartmentsRepository,
      fakeUsersRepository,
      fakeHashProvider,
      fakeMailProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

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

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account.id,
      position_id: position.id,
      department_id: department.id,
    });

    expect(user).toHaveProperty('id');
    expect(sendMail).toBeCalled();
  });

  it('should not be able to create a new user with same email from another', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

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

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      account_id: account.id,
      position_id: position.id,
      department_id: department.id,
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        account_id: account.id,
        position_id: position.id,
        department_id: department.id,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(sendMail).toBeCalledTimes(1);
  });

  it('should not be able to create a new user with unknown position', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const department = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'Marketing',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        account_id: account.id,
        position_id: 'unknown-position-id',
        department_id: department.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with unknown department', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const position = await fakePositionsRepository.create({
      account_id: account.id,
      points: 100,
      position_name: 'Manager',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        account_id: account.id,
        position_id: position.id,
        department_id: 'unknown-department-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with position from another account', async () => {
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

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        account_id: account_2.id,
        position_id: account_1_position.id,
        department_id: department.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with department from another account', async () => {
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

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        account_id: account_2.id,
        position_id: position.id,
        department_id: account_1_department.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
