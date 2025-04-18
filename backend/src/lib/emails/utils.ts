import { env } from '../env'
import { execSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import fg from 'fast-glob'
import Handlebars from 'handlebars'
import _ from 'lodash'
import { mkdirp } from 'mkdirp'
import { rimraf } from 'rimraf'
import { sendEmailThroughBrevo } from '../brevo'
import { logger } from '../logger'

export async function getFilesInFolder(dirPath: string, excludePatterns: string[]): Promise<string[]> {
  // Игнорировать _* файлы: ['**/_*']
  const pattern = path.join(dirPath, '**', '*').replace(/\\/g, '/')
  const files = await fg(pattern, {
    absolute: false,
    onlyFiles: true,
    caseSensitiveMatch: false,
    ignore: excludePatterns,
  })
  return files
}

export async function compileEmailTemplates() {
  const emailsSrc = path.join('src', 'emails', 'mjml').replace(/\\/g, '/')
  const emailDst = path.join('src', 'emails', 'dist')
  try {
    // Очистка и создание директории
    rimraf.sync(emailDst)
    mkdirp.sync(emailDst)
    const mjmlFiles = await getFilesInFolder(emailsSrc, ['**/_*'])
    mjmlFiles.forEach((file) => {
      const output = path.join(emailDst, path.basename(file, '.mjml') + '.html')
      execSync(`mjml ${file} -o ${output}`)
    })
    logger.info('email', 'Email templates built successfully!')
  } catch (error) {
    logger.error('Error building email templates:', error)
    process.exit(1)
  }
}

const getHbrTemplates = _.memoize(async () => {
  const htmlPathsPattern = path.resolve(__dirname, '../../emails/dist/**/*.html')
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

export const sendEmail = async ({
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
