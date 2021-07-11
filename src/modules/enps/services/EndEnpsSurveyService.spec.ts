import AppError from '@shared/errors/AppError';

import FakeEnpsSurveyRepository from '@modules/enps/repositories/fakes/FakeEnpsSurveyRepository';
import EndEnpsSurveyService from './EndEnpsSurveyService';

let fakeEnpsSurveyRepository: FakeEnpsSurveyRepository;

let endEnpsSurvey: EndEnpsSurveyService;

describe('EndEnpsSurvey', () => {
  beforeEach(() => {
    fakeEnpsSurveyRepository = new FakeEnpsSurveyRepository();

    endEnpsSurvey = new EndEnpsSurveyService(fakeEnpsSurveyRepository);
  });

  it('should be able to end ENPS Survey', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: new Date(),
      question: 'fake question',
    });

    const enps_survey = await endEnpsSurvey.execute({
      account_id: 'fake-account-id',
      enps_survey_id: saved_enps_survey.id,
    });

    expect(enps_survey).toHaveProperty('ended_at');
  });

  it('should not be able to end ENPS Survey from another account', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: new Date(),
      question: 'fake question',
    });

    await expect(
      endEnpsSurvey.execute({
        account_id: 'another-fake-account-id',
        enps_survey_id: saved_enps_survey.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
