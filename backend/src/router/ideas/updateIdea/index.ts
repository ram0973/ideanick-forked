import { trpc } from '../../../lib/trpc'
import { zUpdateIdeaTrpcInput } from './input'

export const updateIdeaTrpcRoute = trpc.procedure.input(zUpdateIdeaTrpcInput).mutation(async ({ ctx, input }) => {
  const { ideaId, ...ideaInput } = input
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  })
  if (!idea) {
    throw new Error('NOT_FOUND')
  }
  if (ctx.me.id !== idea.authorId) {
    throw new Error('NOT_YOUR_IDEA')
  }
  if (idea.nick !== input.nick) {
    const exIdea = await ctx.prisma.idea.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exIdea) {
      throw new Error('Idea with this nick already exists')
    }
  }
  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      ...ideaInput,
    },
  })
  return true
})
