import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCommentService from '@modules/recognition_posts/services/CreateCommentService';

export default class CommentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { recognition_post_id } = request.params;
    const { content } = request.body;

    const createComment = container.resolve(CreateCommentService);

    const recognition_post = await createComment.execute({
      user_id: id,
      recognition_post_id,
      content,
    });

    return response.json(recognition_post);
  }
}
