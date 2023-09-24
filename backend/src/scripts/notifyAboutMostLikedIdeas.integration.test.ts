import { startOfMonth, sub } from 'date-fns'
import { appContext, createIdeaLike, createIdeaWithAuthor, withoutNoize } from '../test/integration'
import { getMostLikedIdeas } from './notifyAboutMostLikedIdeas'

describe('getMostLikedIdeas', () => {
  it('return most liked ideas of prev month', async () => {
    // has 3 likes in prev month
    const { idea: idea1, author: author1 } = await createIdeaWithAuthor({ number: 1 })

    // has 2 like in prev month, and 2 like in prev prev month
    const { idea: idea2, author: author2 } = await createIdeaWithAuthor({ number: 2 })

    // has 1 like in prev month, and 1 like in prev prev month
    const { idea: idea3, author: author3 } = await createIdeaWithAuthor({ number: 3 })

    // has 3 likes in prev prev month
    const { idea: idea4, author: author4 } = await createIdeaWithAuthor({ number: 4 })

    // has no likes
    await createIdeaWithAuthor({ number: 5 })

    const now = startOfMonth(new Date())
    const prevMonthDate = sub(now, {
      days: 10,
    })
    const prevPrevMonthDate = sub(now, {
      days: 10,
      months: 1,
    })

    await createIdeaLike({ idea: idea1, liker: author1, createdAt: prevMonthDate })
    await createIdeaLike({ idea: idea1, liker: author2, createdAt: prevMonthDate })
    await createIdeaLike({ idea: idea1, liker: author3, createdAt: prevMonthDate })

    await createIdeaLike({ idea: idea2, liker: author1, createdAt: prevMonthDate })
    await createIdeaLike({ idea: idea2, liker: author2, createdAt: prevMonthDate })
    await createIdeaLike({ idea: idea2, liker: author3, createdAt: prevPrevMonthDate })
    await createIdeaLike({ idea: idea2, liker: author4, createdAt: prevPrevMonthDate })

    await createIdeaLike({ idea: idea3, liker: author1, createdAt: prevMonthDate })
    await createIdeaLike({ idea: idea3, liker: author2, createdAt: prevPrevMonthDate })

    await createIdeaLike({ idea: idea4, liker: author1, createdAt: prevPrevMonthDate })
    await createIdeaLike({ idea: idea4, liker: author2, createdAt: prevPrevMonthDate })
    await createIdeaLike({ idea: idea4, liker: author3, createdAt: prevPrevMonthDate })

    expect(withoutNoize(await getMostLikedIdeas(appContext, 2, now))).toMatchInlineSnapshot(`
[
  {
    "name": "Idea 1",
    "nick": "idea1",
    "thisMonthLikesCount": 3,
  },
  {
    "name": "Idea 2",
    "nick": "idea2",
    "thisMonthLikesCount": 2,
  },
]
`)
    expect(withoutNoize(await getMostLikedIdeas(appContext, 10, now))).toMatchInlineSnapshot(`
[
  {
    "name": "Idea 1",
    "nick": "idea1",
    "thisMonthLikesCount": 3,
  },
  {
    "name": "Idea 2",
    "nick": "idea2",
    "thisMonthLikesCount": 2,
  },
  {
    "name": "Idea 3",
    "nick": "idea3",
    "thisMonthLikesCount": 1,
  },
]
`)
  })
})
