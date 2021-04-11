import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IPositionsRepository from '../../repositories/IPositionsRepository';

import Position from '../../infra/typeorm/entities/Position';

interface IRequest {
  position_id: string;
  position_name: string;
  points: number;
  account_id: string;
}

@injectable()
class UpdatePositionService {
  constructor(
    @inject('PositionsRepository')
    private positionsRepository: IPositionsRepository,
  ) {}

  public async execute({
    position_id,
    position_name,
    points,
    account_id,
  }: IRequest): Promise<Position> {
    const position = await this.positionsRepository.findById(position_id);

    if (!position || position.account_id !== account_id) {
      throw new AppError('Position not found.');
    }

    const positionWithSameName = await this.positionsRepository.findByName({
      position_name,
      account_id,
    });

    if (positionWithSameName && positionWithSameName.id !== position_id) {
      throw new AppError('Position name already used.');
    }

    return this.positionsRepository.save({
      ...position,
      points,
      position_name,
    });
  }
}

export default UpdatePositionService;
