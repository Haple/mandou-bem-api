import ICreateProviderAccountDTO from '../dtos/ICreateProviderAccountDTO';
import ProviderAccount from '../infra/typeorm/entities/ProviderAccount';

export default interface IProviderAccountsRepository {
  findAll(): Promise<ProviderAccount[]>;
  findByEmail(email: string): Promise<ProviderAccount | undefined>;
  create(data: ICreateProviderAccountDTO): Promise<ProviderAccount>;
  save(provider: ProviderAccount): Promise<ProviderAccount>;
  findById(id: string): Promise<ProviderAccount | undefined>;
}
