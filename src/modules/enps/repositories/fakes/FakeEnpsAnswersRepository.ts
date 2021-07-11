import ICreateEnpsAnswerDTO from '@modules/enps/dtos/ICreateEnpsAnswerDTO';
import EnpsAnswer from '@modules/enps/infra/typeorm/entities/EnpsAnswer';
import { uuid } from 'uuidv4';
import IEnpsAnswersRepository from '../IEnpsAnswersRepository';

class FakeEnpsAnswersRepository implements IEnpsAnswersRepository {
  private enps_answers: EnpsAnswer[] = [];

  public async findAllFromUserAndSurveys(
    user_id: string,
    surveys_ids: string[],
  ): Promise<EnpsAnswer[]> {
    return this.enps_answers.filter(
      enps_answer =>
        enps_answer.user_id === user_id &&
        surveys_ids.includes(enps_answer.enps_survey_id),
    );
  }

  public async create(
    enpsAnswerData: ICreateEnpsAnswerDTO,
  ): Promise<EnpsAnswer> {
    const enps_answer = new EnpsAnswer();

    Object.assign(enps_answer, { id: uuid() }, enpsAnswerData);

    this.enps_answers.push(enps_answer);

    return enps_answer;
  }

  public async save(enps_answer: EnpsAnswer): Promise<EnpsAnswer> {
    const findIndex = this.enps_answers.findIndex(
      findEnpsAnswer => findEnpsAnswer.id === enps_answer.id,
    );

    if (findIndex === -1) {
      this.enps_answers.push(enps_answer);
      return enps_answer;
    }

    this.enps_answers[findIndex] = enps_answer;

    return enps_answer;
  }
}

export default FakeEnpsAnswersRepository;
