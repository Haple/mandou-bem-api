import FakeEnpsAnswersRepository from '../repositories/fakes/FakeEnpsAnswersRepository';
import ListEnpsAnswersService from './ListEnpsAnswersService';

let fakeEnpsAnswersRepository: FakeEnpsAnswersRepository;
let listEnpsAnswers: ListEnpsAnswersService;

const enps_answer = {
  enps_survey_id: 'fake-enps-survey-id',
  user_id: 'fake-user-id',
  answer: 'fake-answer',
  score: 10,
};

describe('ListEnpsAnswers', () => {
  beforeEach(() => {
    fakeEnpsAnswersRepository = new FakeEnpsAnswersRepository();

    listEnpsAnswers = new ListEnpsAnswersService(fakeEnpsAnswersRepository);
  });

  it('should be able to list enps answers', async () => {
    await fakeEnpsAnswersRepository.create(enps_answer);
    await fakeEnpsAnswersRepository.create(enps_answer);

    const recognition_posts = await listEnpsAnswers.execute({
      enps_survey_id: 'fake-enps-survey-id',
      page: 0,
      size: 2,
    });

    expect(recognition_posts.total).toBe(2);
  });

  it('should be able to list enps answers and paginate', async () => {
    await fakeEnpsAnswersRepository.create(enps_answer);
    await fakeEnpsAnswersRepository.create(enps_answer);

    const recognition_posts = await listEnpsAnswers.execute({
      enps_survey_id: 'fake-enps-survey-id',
      page: 0,
      size: 1,
    });

    expect(recognition_posts.total).toBe(1);
  });
});
