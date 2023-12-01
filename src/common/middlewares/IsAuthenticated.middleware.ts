import { UnauthorizedException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
  private API_KEY: string;
  private JWT_SECRET: string;
  constructor(private readonly configService: ConfigService) {
    this.API_KEY = this.configService.get('API_KEY');
    this.JWT_SECRET = this.configService.get('JWT_SECRET');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const api_key = req.header('api_key');
    if (api_key && api_key !== this.API_KEY) throw new UnauthorizedException('Invalid API_KEY');
    else if (api_key) return next();

    const token = req.headers.authorization?.split(' ')[1]; //Excepted 'Bearer ...'
    if (!token) throw new UnauthorizedException('Authorization required');

    try {
      verify(token, this.JWT_SECRET);
      // req['user'] = await admin.auth().verifyIdToken(token);
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
