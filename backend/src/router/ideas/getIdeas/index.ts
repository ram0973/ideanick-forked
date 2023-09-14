import { trpc } from '../../../lib/trpc'
import { zGetIdeasTrpcInput } from './input'

export const getIdeasTrpcRoute = trpc.procedure.input(zGetIdeasTrpcInput).query(async ({ ctx, input }) => {
  const ideas = await ctx.prisma.idea.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
      serialNumber: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })
  const nextIdea = ideas.at(input.limit)
  const nextCursor = nextIdea?.serialNumber
  const ideasExceptNext = ideas.slice(0, input.limit)

  return { ideas: ideasExceptNext, nextCursor }
})
