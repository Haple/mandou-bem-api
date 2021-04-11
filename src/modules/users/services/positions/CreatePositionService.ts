import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IPositionsRepository from '../../repositories/IPositionsRepository';

import Position from '../../infra/typeorm/entities/Position';

interface IRequest {
  position_name: string;
  points: number;
  account_id: string;
}

@injectable()
class CreatePositionService {
  constructor(
    @inject('PositionsRepository')
    private positionsRepository: IPositionsRepository,
  ) {}

  public async execute({
    position_name,
    points,
    account_id,
  }: IRequest): Promise<Position> {
    const positionWithSameName = await this.positionsRepository.findByName({
      position_name,
      account_id,
    });

    if (positionWithSameName) {
      throw new AppError('Position name already used.');
    }

    const position = await this.positionsRepository.create({
      position_name,
      points,
      account_id,
    });

    return position;
  }
}

export default CreatePositionService;
