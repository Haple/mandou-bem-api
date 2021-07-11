import AppError from '@shared/errors/AppError';

import FakeEnpsSurveyRepository from '@modules/enps/repositories/fakes/FakeEnpsSurveyRepository';
import GetEnpsSurveyService from './GetEnpsSurveyService';

let fakeEnpsSurveyRepository: FakeEnpsSurveyRepository;

let getEnpsSurvey: GetEnpsSurveyService;

describe('GetEnpsSurvey', () => {
  beforeEach(() => {
    fakeEnpsSurveyRepository = new FakeEnpsSurveyRepository();

    getEnpsSurvey = new GetEnpsSurveyService(fakeEnpsSurveyRepository);
  });

  it('should be able to get ENPS Survey', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: new Date(),
      question: 'fake question',
    });

    const enps_survey = await getEnpsSurvey.execute({
      account_id: 'fake-account-id',
      enps_survey_id: saved_enps_survey.id,
    });

    expect(enps_survey).toHaveProperty('id');
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
