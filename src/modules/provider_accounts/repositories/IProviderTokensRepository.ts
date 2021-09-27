import ProviderToken from '../infra/typeorm/entities/ProviderToken';

export default interface IProviderTokensRepository {
  generate(user_id: string): Promise<ProviderToken>;
  findByToken(token: string): Promise<ProviderToken | undefined>;
}
