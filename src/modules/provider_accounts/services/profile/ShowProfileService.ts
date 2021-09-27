import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProviderAccountsRepository from '../../repositories/IProviderAccountsRepository';

import ProviderAccount from '../../infra/typeorm/entities/ProviderAccount';

interface IRequest {
  provider_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('ProviderAccountsRepository')
    private providerAccountsRepository: IProviderAccountsRepository,
  ) {}

  public async execute({ provider_id }: IRequest): Promise<ProviderAccount> {
    const provider = await this.providerAccountsRepository.findById(
      provider_id,
    );

    if (!provider) {
      throw new AppError('Provider not found');
    }

    return provider;
  }
}

export default ShowProfileService;
