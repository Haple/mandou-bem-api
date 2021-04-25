import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  provider_name: string;
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureProviderAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, provider_name } = decoded as ITokenPayload;

    if (!provider_name) {
      throw new AppError('Only providers are allowed to do this', 403);
    }

    request.provider = {
      id: sub,
      provider_name,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
