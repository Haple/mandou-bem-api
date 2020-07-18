import Account from '../infra/typeorm/entities/Account';

export default interface ICreateUserDTO {
  account: Account;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
}
