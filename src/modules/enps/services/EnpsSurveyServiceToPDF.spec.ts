import AppError from '@shared/errors/AppError';

import FakeEnpsSurveyRepository from '@modules/enps/repositories/fakes/FakeEnpsSurveyRepository';
import FakePDFProvider from '@shared/container/providers/PDFProvider/fakes/FakePDFProvider';
import EnpsSurveyToPDFService from './EnpsSurveyToPDFService';
import FakeEnpsAnswersRepository from '../repositories/fakes/FakeEnpsAnswersRepository';

let fakeEnpsSurveyRepository: FakeEnpsSurveyRepository;
let fakeEnpsAnswersRepository: FakeEnpsAnswersRepository;
let fakePDFProvider: FakePDFProvider;

let getEnpsSurvey: EnpsSurveyToPDFService;

describe('EnpsSurveyToPDF', () => {
  beforeEach(() => {
    fakeEnpsSurveyRepository = new FakeEnpsSurveyRepository();
    fakeEnpsAnswersRepository = new FakeEnpsAnswersRepository();
    fakePDFProvider = new FakePDFProvider();

    getEnpsSurvey = new EnpsSurveyToPDFService(
      fakeEnpsSurveyRepository,
      fakeEnpsAnswersRepository,
      fakePDFProvider,
    );
  });

  it('should be able to generate ENPS Survey PDF', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: new Date(),
      question: 'fake question',
    });
    const enps_answer = {
      enps_survey_id: saved_enps_survey.id,
      user_id: 'fake-user-id',
      answer: 'fake-answer',
      score: 10,
    };
    await fakeEnpsAnswersRepository.create(enps_answer);

    const enps_survey = await getEnpsSurvey.execute({
      account_id: 'fake-account-id',
      enps_survey_id: saved_enps_survey.id,
    });

    expect(enps_survey).toBeTruthy();
  });

  it('should not be able to get ENPS Survey from another account', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: new Date(),
      question: 'fake question',
    });

    await expect(
      getEnpsSurvey.execute({
        account_id: 'another-fake-account-id',
        enps_survey_id: saved_enps_survey.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
