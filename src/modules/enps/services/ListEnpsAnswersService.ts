import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@modules/enps/dtos/IPaginationDTO';
import IEnpsAnswersRepository from '../repositories/IEnpsAnswersRepository';
import EnpsAnswer from '../infra/typeorm/entities/EnpsAnswer';

interface IRequest {
  enps_survey_id: string;
  page: number;
  size: number;
}

@injectable()
class ListEnpsAnswersService {
  constructor(
    @inject('EnpsAnswersRepository')
    private enpsAnswersRepository: IEnpsAnswersRepository,
  ) {}

  public async execute({
    enps_survey_id,
    page,
    size,
  }: IRequest): Promise<IPaginationDTO<EnpsAnswer>> {
    const enps_answers = await this.enpsAnswersRepository.findAllFromSurveyPaginated(
      enps_survey_id,
      page,
      size,
    );

    return enps_answers;
  }
}

export default ListEnpsAnswersService;
