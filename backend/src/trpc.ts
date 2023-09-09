import { initTRPC } from '@trpc/server'
import _ from 'lodash'

const ideas = _.times(100, (i) => ({
  nick: `cool-idea-nick-${i}`,
  name: `Idea ${i}`,
  description: `Description of idea ${i}...`,
  text: _.times(100, (j) => `<p>Text paragrph ${j} of idea ${i}...</p>`).join(''),
}))

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getIdeas: trpc.procedure.query(() => {
    return { ideas: ideas.map((idea) => _.pick(idea, ['nick', 'name', 'description'])) }
  }),
})

export type TrpcRouter = typeof trpcRouter
