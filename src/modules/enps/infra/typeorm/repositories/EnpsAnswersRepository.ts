import ICreateEnpsAnswerDTO from '@modules/enps/dtos/ICreateEnpsAnswerDTO';
import IEnpsAnswersRepository from '@modules/enps/repositories/IEnpsAnswersRepository';
import { getRepository, Repository, In } from 'typeorm';

import EnpsAnswer from '../entities/EnpsAnswer';

class EnpsAnswersRepository implements IEnpsAnswersRepository {
  private ormRepository: Repository<EnpsAnswer>;

  constructor() {
    this.ormRepository = getRepository(EnpsAnswer);
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
