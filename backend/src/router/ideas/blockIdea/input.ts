import { z } from 'zod'

export const zBlockIdeaTrpcInput = z.object({
  ideaId: z.string().min(1),
})
