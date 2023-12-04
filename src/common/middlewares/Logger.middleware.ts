import { NextFunction, Request } from 'express';

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req);
  if (req.method.toUpperCase() === 'OPTIONS') return next();
  console.log(`${req.method.toUpperCase()}: ${req.baseUrl}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  next();
}
