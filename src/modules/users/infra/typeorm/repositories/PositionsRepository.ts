import { getRepository, Repository } from 'typeorm';

import IFindPositionByNameDTO from '../../../dtos/IFindPositionByNameDTO';
import ICreatePositionDTO from '../../../dtos/ICreatePositionDTO';
import IPositionRepository from '../../../repositories/IPositionsRepository';
import Position from '../entities/Position';

class PositionsRepository implements IPositionRepository {
  private ormRepository: Repository<Position>;

  constructor() {
    this.ormRepository = getRepository(Position);
  }

  public async findByName({
    account_id,
    position_name,
  }: IFindPositionByNameDTO): Promise<Position | undefined> {
    const position = await this.ormRepository.findOne({
      where: {
        account_id,
        position_name,
      },
    });
    return position;
  }

  public async findById(id: string): Promise<Position | undefined> {
    const position = await this.ormRepository.findOne(id);

    return position;
  }

  public async findAllFromAccount(account_id: string): Promise<Position[]> {
    const positions = await this.ormRepository.find({
      where: {
        account_id,
      },
    });

    return positions;
  }

  public async create(position_data: ICreatePositionDTO): Promise<Position> {
    const position = this.ormRepository.create(position_data);

    await this.ormRepository.save(position);

    return position;
  }

  public async save(position: Position): Promise<Position> {
    return this.ormRepository.save(position);
  }

  public async remove(position: Position): Promise<void> {
    await this.ormRepository.softRemove(position);
  }
}

export default PositionsRepository;
