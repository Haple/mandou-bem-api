import AppError from '@shared/errors/AppError';

import FakeEnpsSurveyRepository from '@modules/enps/repositories/fakes/FakeEnpsSurveyRepository';
import { addDays, subDays } from 'date-fns';
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

  it('should be able to get ENPS Survey score and total responses', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: new Date(),
      question: 'fake question',
    });

    Object.assign(saved_enps_survey, {
      promoters: 10,
      passives: 4,
      detractors: 5,
    });

    await fakeEnpsSurveyRepository.save(saved_enps_survey);

    const enps_survey = await getEnpsSurvey.execute({
      account_id: 'fake-account-id',
      enps_survey_id: saved_enps_survey.id,
    });

    expect(enps_survey.getEnpScore()).toBe(26);
    expect(enps_survey.getTotaResponses()).toBe(19);
  });

  it('should be able to get ENPS Survey that ended yesterday', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: subDays(new Date(), 1),
      question: 'fake question',
    });

    Object.assign(saved_enps_survey, {
      ended_at: new Date(),
    });

    await fakeEnpsSurveyRepository.save(saved_enps_survey);

    const enps_survey = await getEnpsSurvey.execute({
      account_id: 'fake-account-id',
      enps_survey_id: saved_enps_survey.id,
    });

    expect(enps_survey.isEnded()).toBeTruthy();
  });

  it('should be able to get ENPS Survey that was manually ended', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'fake question',
    });

    Object.assign(saved_enps_survey, {
      ended_at: new Date(),
    });

    await fakeEnpsSurveyRepository.save(saved_enps_survey);

    const enps_survey = await getEnpsSurvey.execute({
      account_id: 'fake-account-id',
      enps_survey_id: saved_enps_survey.id,
    });

    expect(enps_survey.isEnded()).toBeTruthy();
  });

  it('should be able to get ENPS Survey that was not ended', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'fake question',
    });

    await fakeEnpsSurveyRepository.save(saved_enps_survey);

    const enps_survey = await getEnpsSurvey.execute({
      account_id: 'fake-account-id',
      enps_survey_id: saved_enps_survey.id,
    });

    expect(enps_survey.isEnded()).toBeFalsy();
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
