import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateRecognitionPostService from '@modules/recognition_posts/services/CreateRecognitionPostService';

export default class RecognitionPostsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { to_user_id, content, recognition_points } = request.body;

    const createRecognitionPost = container.resolve(
      CreateRecognitionPostService,
    );

    const recognition_post = await createRecognitionPost.execute({
      from_user_id: id,
      to_user_id,
      content,
      recognition_points,
    });

    return response.json(recognition_post);
  }
}
