import type { TrpcRouterOutput } from '@ideanick/backend/src/router'
import format from 'date-fns/format'
import { useParams } from 'react-router-dom'
import { LinkButton } from '../../../components/Button'
import { Segment } from '../../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditIdeaRoute, type ViewIdeaRouteParams } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import css from './index.module.scss'

const LikeButton = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const trpcUtils = trpc.useContext()
  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcUtils.getIdea.getData({ ideaNick: idea.nick })
      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: oldGetIdeaData.idea.likesCount + (isLikedByMe ? 1 : -1),
          },
        }
        trpcUtils.getIdea.setData({ ideaNick: idea.nick }, newGetIdeaData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getIdea.invalidate({ ideaNick: idea.nick })
    },
  })
  return (
    <button
      className={css.likeButton}
      onClick={() => {
        void setIdeaLike.mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
      }}
    >
      {idea.isLikedByMe ? 'Unlike' : 'Like'}
    </button>
  )
}

export const ViewIdeaPage = withPageWrapper({
  useQuery: () => {
    const { ideaNick } = useParams() as ViewIdeaRouteParams
    return trpc.getIdea.useQuery({
      ideaNick,
    })
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    idea: checkExists(queryResult.data.idea, 'Idea not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
})(({ idea, me }) => (
  <Segment title={idea.name} description={idea.description}>
    <div className={css.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
    <div className={css.author}>
      Author: {idea.author.nick}
      {idea.author.name ? ` (${idea.author.name})` : ''}
    </div>
    <div className={css.text} dangerouslySetInnerHTML={{ __html: idea.text }} />
    <div className={css.likes}>
      Likes: {idea.likesCount}
      {me && (
        <>
          <br />
          <LikeButton idea={idea} />
        </>
      )}
    </div>
    {me?.id === idea.authorId && (
      <div className={css.editButton}>
        <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })}>Edit Idea</LinkButton>
      </div>
    )}
  </Segment>
))
