import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RecognitionRankingService from '@modules/recognition_posts/services/RecognitionRankingService';

export default class RecognitionRankingController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;

    const recognitionRanking = container.resolve(RecognitionRankingService);

    const ranking = await recognitionRanking.execute({
      account_id,
    });

    return response.json(ranking);
  }
}
