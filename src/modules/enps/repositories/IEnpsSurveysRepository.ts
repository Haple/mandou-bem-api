import EnpsSurvey from '../infra/typeorm/entities/EnpsSurvey';
import ICreateEnpsSurveyDTO from '../dtos/ICreateEnpsSurveyDTO';

export default interface IEnpsSurveysRepository {
  findAllFromAccount(account_id: string): Promise<EnpsSurvey[]>;
  findById(id: string): Promise<EnpsSurvey | undefined>;
  create(data: ICreateEnpsSurveyDTO): Promise<EnpsSurvey>;
  save(enpsSurvey: EnpsSurvey): Promise<EnpsSurvey>;
}
