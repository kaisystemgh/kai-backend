import { NextFunction } from 'express';

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method.toUpperCase() === 'OPTIONS') return next();
  console.log(`${req.method.toUpperCase()}: ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  next();
}
