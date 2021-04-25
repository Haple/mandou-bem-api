import ICreateProviderAccountDTO from '../dtos/ICreateProviderAccountDTO';
import ProviderAccount from '../infra/typeorm/entities/ProviderAccount';

export default interface IProviderAccountsRepository {
  findByEmail(email: string): Promise<ProviderAccount | undefined>;
  create(data: ICreateProviderAccountDTO): Promise<ProviderAccount>;
}
