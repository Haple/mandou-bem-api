import ICreateEnpsSurveyDTO from '@modules/enps/dtos/ICreateEnpsSurveyDTO';
import IFindAvailableEnpsSurveysDTO from '@modules/enps/dtos/IFindAvailableEnpsSurveysDTO';
import EnpsSurvey from '@modules/enps/infra/typeorm/entities/EnpsSurvey';
import { isAfter } from 'date-fns';
import { uuid } from 'uuidv4';
import IEnpsSurveysRepository from '../IEnpsSurveysRepository';

class FakeEnpsSurveyRepository implements IEnpsSurveysRepository {
  private enps_surveys: EnpsSurvey[] = [];

  public async findAllAvailable({
    account_id,
    department_id,
    position_id,
  }: IFindAvailableEnpsSurveysDTO): Promise<EnpsSurvey[]> {
    return this.enps_surveys.filter(
      enps_survey =>
        enps_survey.account_id === account_id &&
        isAfter(enps_survey.end_date, new Date()) &&
        enps_survey.ended_at == null &&
        (enps_survey.department_id === department_id ||
          enps_survey.department_id == null) &&
        (enps_survey.position_id === position_id ||
          enps_survey.position_id == null),
    );
  }

  public async findAllFromAccount(account_id: string): Promise<EnpsSurvey[]> {
    return this.enps_surveys.filter(
      enps_survey => enps_survey.account_id === account_id,
    );
  }

  public async findById(id: string): Promise<EnpsSurvey | undefined> {
    const findUser = this.enps_surveys.find(user => user.id === id);
    return findUser;
  }

  public async create(
    enpsSurveyData: ICreateEnpsSurveyDTO,
  ): Promise<EnpsSurvey> {
    const enps_survey = new EnpsSurvey();

    Object.assign(enps_survey, { id: uuid() }, enpsSurveyData);

    this.enps_surveys.push(enps_survey);

    return enps_survey;
  }

  public async save(enps_survey: EnpsSurvey): Promise<EnpsSurvey> {
    const findIndex = this.enps_surveys.findIndex(
      findEnpsSurvey => findEnpsSurvey.id === enps_survey.id,
    );

    if (findIndex === -1) {
      this.enps_surveys.push(enps_survey);
      return enps_survey;
    }

    this.enps_surveys[findIndex] = enps_survey;

    return enps_survey;
  }
}

export default FakeEnpsSurveyRepository;
