import { promises as fs } from 'fs'
import path from 'path'
import { getNewIdeaRoute, getViewIdeaRoute } from '@ideanick/webapp/src/lib/routes'
import { type Idea, type User } from '@prisma/client'
import fg from 'fast-glob'
import Handlebars from 'handlebars'
import _ from 'lodash'
import { sendEmailThroughBrevo } from './brevo'
import { env } from './env'
import { logger } from './logger'

const getHbrTemplates = _.memoize(async () => {
  const htmlPathsPattern = path.resolve(__dirname, '../emails/dist/**/*.html')
  const htmlPaths = fg.sync(htmlPathsPattern)
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {}
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html')
    const htmlTemplate = await fs.readFile(htmlPath, 'utf8')
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate)
  }
  return hbrTemplates
})

const getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates()
  const hbrTemplate = hbrTemplates[templateName]
  const html = hbrTemplate(templateVariables)
  return html
}

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string
  subject: string
  templateName: string
  templateVariables?: Record<string, any>
}) => {
  try {
    const fullTemplateVaraibles = {
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    }
    const html = await getEmailHtml(templateName, fullTemplateVaraibles)
    const { loggableResponse } = await sendEmailThroughBrevo({ to, html, subject })
    logger.info('email', 'sendEmail', {
      to,
      templateName,
      templateVariables,
      response: loggableResponse,
    })
    return { ok: true }
  } catch (error) {
    logger.error('email', error, {
      to,
      templateName,
      templateVariables,
    })
    return { ok: false }
  }
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks For Registration!',
    templateName: 'welcome',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: `${getNewIdeaRoute({ abs: true })}`,
    },
  })
}

export const sendIdeaBlockedEmail = async ({ user, idea }: { user: Pick<User, 'email'>; idea: Pick<Idea, 'nick'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Your Idea Blocked!',
    templateName: 'ideaBlocked',
    templateVariables: {
      ideaNick: idea.nick,
    },
  })
}

export const sendMostLikedIdeasEmail = async ({
  user,
  ideas,
}: {
  user: Pick<User, 'email'>
  ideas: Array<Pick<Idea, 'nick' | 'name'>>
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Most Liked Ideas!',
    templateName: 'mostLikedIdeas',
    templateVariables: {
      ideas: ideas.map((idea) => ({ name: idea.name, url: getViewIdeaRoute({ abs: true, ideaNick: idea.nick }) })),
    },
  })
}
