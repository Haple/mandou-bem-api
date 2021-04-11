import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IPositionsRepository from '../../repositories/IPositionsRepository';

interface IRequest {
  account_id: string;
  position_id: string;
}

@injectable()
class DeletePositionService {
  constructor(
    @inject('PositionsRepository')
    private positionsRepository: IPositionsRepository,
  ) {}

  public async execute({ account_id, position_id }: IRequest): Promise<void> {
    const position = await this.positionsRepository.findById(position_id);

    if (position && position.account_id === account_id) {
      await this.positionsRepository.remove(position);
      return;
    }

    throw new AppError('Position not found.', 404);
  }
}

export default DeletePositionService;
