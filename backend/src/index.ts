// eslint-disable-next-line import/order
import cors from 'cors'
import express from 'express'
import { applyCron } from './lib/cron'
import { createAppContext, type AppContext } from './lib/ctx'
import { env } from './lib/env'
import { logger } from './lib/logger'
import { applyPassportToExpressApp } from './lib/passport'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'
import { presetDb } from './scripts/presetDb'

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    await presetDb(ctx)
    const expressApp = express()
    expressApp.use(cors())
    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })
    applyPassportToExpressApp(expressApp, ctx)
    await applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    applyCron(ctx)
    expressApp.listen(env.PORT, () => {
      logger.info(`Listening at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    logger.error(error)
    await ctx?.stop()
  }
})()
