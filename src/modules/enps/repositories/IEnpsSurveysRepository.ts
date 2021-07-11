import EnpsSurvey from '../infra/typeorm/entities/EnpsSurvey';
import ICreateEnpsSurveyDTO from '../dtos/ICreateEnpsSurveyDTO';
import IFindAvailableEnpsSurveysDTO from '../dtos/IFindAvailableEnpsSurveysDTO';

export default interface IEnpsSurveysRepository {
  findAllAvailable(
    filters: IFindAvailableEnpsSurveysDTO,
  ): Promise<EnpsSurvey[]>;
  findAllFromAccount(account_id: string): Promise<EnpsSurvey[]>;
  findById(id: string): Promise<EnpsSurvey | undefined>;
  create(data: ICreateEnpsSurveyDTO): Promise<EnpsSurvey>;
  save(enpsSurvey: EnpsSurvey): Promise<EnpsSurvey>;
}
