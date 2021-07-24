import ICreateEnpsAnswerDTO from '@modules/enps/dtos/ICreateEnpsAnswerDTO';
import IPaginationDTO from '@modules/enps/dtos/IPaginationDTO';
import IEnpsAnswersRepository from '@modules/enps/repositories/IEnpsAnswersRepository';
import { getRepository, Repository, In } from 'typeorm';

import EnpsAnswer from '../entities/EnpsAnswer';

class EnpsAnswersRepository implements IEnpsAnswersRepository {
  private ormRepository: Repository<EnpsAnswer>;

  constructor() {
    this.ormRepository = getRepository(EnpsAnswer);
  }

  public async findAllFromSurveyPaginated(
    enps_survey_id: string,
    page: number,
    size: number,
  ): Promise<IPaginationDTO<EnpsAnswer>> {
    const [enps_answers, total] = await this.ormRepository.findAndCount({
      where: {
        enps_survey_id,
      },
      order: {
        created_at: 'DESC',
      },
      skip: page * size,
      take: size,
    });
    return {
      total,
      result: enps_answers,
    };
  }

  public async findAllFromSurvey(
    enps_survey_id: string,
  ): Promise<EnpsAnswer[]> {
    const enps_answers = await this.ormRepository.find({
      where: {
        enps_survey_id,
      },
      order: {
        created_at: 'DESC',
      },
    });
    return enps_answers;
  }

  public async findAllFromUserAndSurveys(
    user_id: string,
    surveys_ids: string[],
  ): Promise<EnpsAnswer[]> {
    const enps_surveys = await this.ormRepository.find({
      where: {
        user_id,
        enps_survey_id: In(surveys_ids),
      },
    });

    return enps_surveys;
  }

  public async findAllFromAccount(account_id: string): Promise<EnpsAnswer[]> {
    const enps_surveys = await this.ormRepository.find({
      where: {
        account_id,
      },
    });

    return enps_surveys;
  }

  public async create(
    enpsAnswerData: ICreateEnpsAnswerDTO,
  ): Promise<EnpsAnswer> {
    const enps_answer = this.ormRepository.create(enpsAnswerData);

    await this.ormRepository.save(enps_answer);

    return enps_answer;
  }

  public async save(enps_answer: EnpsAnswer): Promise<EnpsAnswer> {
    return this.ormRepository.save(enps_answer);
  }
}

export default EnpsAnswersRepository;
