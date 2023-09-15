import _ from 'lodash'
import { z } from 'zod'
import { trpc } from '../../../lib/trpc'

export const getIdeaTrpcRoute = trpc.procedure
  .input(
    z.object({
      ideaNick: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const rawIdea = await ctx.prisma.idea.findUnique({
      where: {
        nick: input.ideaNick,
      },
      include: {
        author: {
          select: {
            id: true,
            nick: true,
            name: true,
          },
        },
        ideasLikes: {
          select: {
            id: true,
          },
          where: {
            userId: ctx.me?.id,
          },
        },
        _count: {
          select: {
            ideasLikes: true,
          },
        },
      },
    })
    const isLikedByMe = !!rawIdea?.ideasLikes.length
    const likesCount = rawIdea?._count.ideasLikes || 0
    const idea = rawIdea && { ..._.omit(rawIdea, ['ideasLikes', '_count']), isLikedByMe, likesCount }

    return { idea }
  })
