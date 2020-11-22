import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateRecognitionPostService from '@modules/recognition_posts/services/CreateRecognitionPostService';
import ListRecognitionPostsService from '@modules/recognition_posts/services/ListRecognitionPostsService';

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

  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;
    const page = (request.query.page as unknown) as number;
    const size = (request.query.size as unknown) as number;

    const listRecognitionPosts = container.resolve(ListRecognitionPostsService);

    const recognition_posts = await listRecognitionPosts.execute({
      account_id,
      page,
      size,
    });

    return response.json(recognition_posts);
  }
}
