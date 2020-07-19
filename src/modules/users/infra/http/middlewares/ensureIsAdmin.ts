import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

export default function ensureIsAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { is_admin } = request.user;
  if (is_admin) {
    return next();
  }
  throw new AppError('Only admins are allowed to do this', 403);
}
