import { serializeError } from 'serialize-error'
import winston from 'winston'
import { env } from './env'

export const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'backend', hostEnv: env.HOST_ENV },
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
})

export const logger = {
  info: (logType: string, message: string, meta?: Record<string, any>) => {
    winstonLogger.info(message, { logType, ...meta })
  },
  error: (logType: string, error: any, meta?: Record<string, any>) => {
    const serializedError = serializeError(error)
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType,
      error,
      errorStack: serializedError.stack,
      ...meta,
    })
  },
}
