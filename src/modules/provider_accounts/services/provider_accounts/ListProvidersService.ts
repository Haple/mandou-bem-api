import { injectable, inject } from 'tsyringe';

import IProviderAccountsRepository from '../../repositories/IProviderAccountsRepository';

interface IResponse {
  id: string;
  company_name: string;
  cnpj: string;
  name: string;
}

@injectable()
class CreateProviderAccountService {
  constructor(
    @inject('ProviderAccountsRepository')
    private providerAccountsRepository: IProviderAccountsRepository,
  ) {}

  public async execute(): Promise<IResponse[]> {
    const providers = await this.providerAccountsRepository.findAll();

    return providers.map(({ id, company_name, cnpj, name }) => ({
      id,
      company_name,
      cnpj,
      name,
    }));
  }
}

export default CreateProviderAccountService;
