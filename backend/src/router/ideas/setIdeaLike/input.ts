import { z } from 'zod'

export const zSetIdeaLikeIdeaTrpcInput = z.object({
  ideaId: z.string().min(1),
  isLikedByMe: z.boolean(),
})
