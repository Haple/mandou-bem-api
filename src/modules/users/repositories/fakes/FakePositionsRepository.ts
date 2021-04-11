import { uuid } from 'uuidv4';

import IFindPositionByNameDTO from '../../dtos/IFindPositionByNameDTO';
import ICreatePositionDTO from '../../dtos/ICreatePositionDTO';

import Position from '../../infra/typeorm/entities/Position';
import IPositionsRepository from '../IPositionsRepository';

class FakePositionsRepository implements IPositionsRepository {
  private positions: Position[] = [];

  public async findById(id: string): Promise<Position | undefined> {
    const position = this.positions.find(p => p.id === id);

    return position;
  }

  public async findByName({
    account_id,
    position_name,
  }: IFindPositionByNameDTO): Promise<Position | undefined> {
    return this.positions.filter(
      position =>
        position.account_id === account_id &&
        position.position_name === position_name,
    )[0];
  }

  public async findAllFromAccount(account_id: string): Promise<Position[]> {
    return this.positions.filter(
      position => position.account_id === account_id,
    );
  }

  public async create(position_data: ICreatePositionDTO): Promise<Position> {
    const position = new Position();

    Object.assign(position, { id: uuid() }, position_data);

    this.positions.push(position);

    return position;
  }

  public async save(position: Position): Promise<Position> {
    const find_index = this.positions.findIndex(
      find_position => find_position.id === position.id,
    );

    this.positions[find_index] = position;

    return position;
  }

  public async remove(position: Position): Promise<void> {
    this.positions.splice(this.positions.indexOf(position), 1);
  }
}

export default FakePositionsRepository;
