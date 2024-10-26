// middleware/logger.ts
import { Request, Response, NextFunction } from 'express'

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const now = new Date().toISOString()
  console.log(`bgapi> REQUEST: [${now}] ${req.method} ${req.url}`)
  console.log('bgapi> ORIGIN:', req.headers.origin)
  console.log('bgapi> BODY:', req.body)
  next()
}
