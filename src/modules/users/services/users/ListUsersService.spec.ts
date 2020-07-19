import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeUsersRepository: FakeUsersRepository;
let listUsers: ListUsersService;

describe('ListUsers', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should list all users from account', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');
    const admin = await fakeUsersRepository.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      account_id: account.id,
      is_admin: true,
    });

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      account_id: account.id,
    });

    await fakeUsersRepository.create({
      name: 'Jessica Hill',
      email: 'jessicahill@example.com',
      password: '123456',
      account_id: account.id,
    });

    const users = await listUsers.execute({
      account_id: account.id,
      except_user_id: admin.id,
    });

    expect(users.length).toBe(2);
  });

  it('should list users by especific username and ignore users from other accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account1Admin1 = await fakeUsersRepository.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      account_id: account1.id,
      is_admin: true,
    });

    const account1User1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      account_id: account1.id,
    });

    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
      account_id: account2.id,
    });

    const users = await listUsers.execute({
      account_id: account1.id,
      username_like: 'john',
      except_user_id: account1Admin1.id,
    });

    expect(users.length).toBe(1);
    expect(users[0].id).toBe(account1User1.id);
  });
});
