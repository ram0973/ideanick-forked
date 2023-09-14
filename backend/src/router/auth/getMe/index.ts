import { toClientMe } from '../../../lib/models'
import { trpc } from '../../../lib/trpc'

export const getMeTrpcRoute = trpc.procedure.query(({ ctx }) => {
  return { me: toClientMe(ctx.me) }
})
