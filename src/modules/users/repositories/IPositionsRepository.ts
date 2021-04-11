import Position from '../infra/typeorm/entities/Position';
import ICreatePositionDTO from '../dtos/ICreatePositionDTO';
import IFindPositionByNameDTO from '../dtos/IFindPositionByNameDTO';

export default interface IPositionRepository {
  findAllFromAccount(account_id: string): Promise<Position[]>;
  findById(id: string): Promise<Position | undefined>;
  findByName(data: IFindPositionByNameDTO): Promise<Position | undefined>;
  create(data: ICreatePositionDTO): Promise<Position>;
  save(position: Position): Promise<Position>;
  remove(position: Position): Promise<void>;
}
