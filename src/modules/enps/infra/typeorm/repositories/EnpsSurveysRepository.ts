import ICreateEnpsSurveyDTO from '@modules/enps/dtos/ICreateEnpsSurveyDTO';
import IFindAvailableEnpsSurveysDTO from '@modules/enps/dtos/IFindAvailableEnpsSurveysDTO';
import IEnpsSurveysRepository from '@modules/enps/repositories/IEnpsSurveysRepository';
import { getRepository, Repository } from 'typeorm';

import EnpsSurvey from '../entities/EnpsSurvey';

class EnpsSurveysRepository implements IEnpsSurveysRepository {
  private ormRepository: Repository<EnpsSurvey>;

  constructor() {
    this.ormRepository = getRepository(EnpsSurvey);
  }

  public async findAllAvailable({
    account_id,
    department_id,
    position_id,
  }: IFindAvailableEnpsSurveysDTO): Promise<EnpsSurvey[]> {
    const enps_surveys = await this.ormRepository
      .createQueryBuilder()
      .select()
      .where(
        'account_id = :account_id' +
          ' AND end_date >= :end_date' +
          ' AND ended_at IS NULL' +
          ' AND (department_id = :department_id OR department_id IS NULL)' +
          ' AND (position_id = :position_id OR position_id IS NULL)',
        {
          account_id,
          end_date: new Date(),
          department_id,
          position_id,
        },
      )
      .getMany();

    return enps_surveys;
  }

  public async findAllFromAccount(account_id: string): Promise<EnpsSurvey[]> {
    const enps_surveys = await this.ormRepository.find({
      where: {
        account_id,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return enps_surveys;
  }

  public async findById(id: string): Promise<EnpsSurvey | undefined> {
    const enps_survey = await this.ormRepository.findOne(id);

    return enps_survey;
  }

  public async create(
    enpsSurveyData: ICreateEnpsSurveyDTO,
  ): Promise<EnpsSurvey> {
    const enps_survey = this.ormRepository.create(enpsSurveyData);

    await this.ormRepository.save(enps_survey);

    return enps_survey;
  }

  public async save(enps_survey: EnpsSurvey): Promise<EnpsSurvey> {
    return this.ormRepository.save(enps_survey);
  }
}

export default EnpsSurveysRepository;
