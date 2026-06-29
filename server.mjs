import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import nodemailer from 'nodemailer'

const loadEnvFile = () => {
  try {
    const envPath = resolve(process.cwd(), '.env')
    const envFile = readFileSync(envPath, 'utf8')

    for (const line of envFile.split(/\r?\n/)) {
      const trimmedLine = line.trim()

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue
      }

      const equalsIndex = trimmedLine.indexOf('=')

      if (equalsIndex === -1) {
        continue
      }

      const key = trimmedLine.slice(0, equalsIndex).trim()
      const rawValue = trimmedLine.slice(equalsIndex + 1).trim()
      const value = rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')

      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {
    // No local env file; fall back to existing process environment.
  }
}

loadEnvFile()

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 8788)
const smtpHost = process.env.SMTP_HOST ?? ''
const smtpPort = Number(process.env.SMTP_PORT ?? 587)
const smtpSecure = String(process.env.SMTP_SECURE ?? 'false').toLowerCase() === 'true'
const smtpUser = process.env.SMTP_USER ?? ''
const smtpPass = (process.env.SMTP_PASS ?? '').replace(/\s+/g, '')
const fromAddress = process.env.MAIL_FROM ?? 'Love Date Planner <you@example.com>'

const smtpConfigured = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && fromAddress)

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null

const readJsonBody = async (request) => {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  return rawBody ? JSON.parse(rawBody) : {}
}

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
  response.end(JSON.stringify(payload))
}

const sendViaSmtp = async ({ recipient, subject, body }) => {
  if (!transporter) {
    throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM.')
  }

  const info = await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br />'),
  })

  return {
    message: 'Mail sent successfully.',
    messageId: info.messageId ?? 'sent',
  }
}

createServer(async (request, response) => {
  if (!request.url?.startsWith('/send-mail') && !request.url?.startsWith('/api/send-mail')) {
    sendJson(response, 404, { error: 'Not found' })
    return
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    })
    response.end()
    return
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  try {
    const body = await readJsonBody(request)
    const { recipient, subject, body: messageBody } = body

    if (typeof recipient !== 'string' || typeof subject !== 'string' || typeof messageBody !== 'string') {
      sendJson(response, 400, { error: 'recipient, subject, and body are required' })
      return
    }

    const result = await sendViaSmtp({ recipient, subject, body: messageBody })
    sendJson(response, 200, result)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unable to send mail.'
    sendJson(response, 500, { error: errorMessage })
  }
}).listen(port, () => {
  console.log(`Mail API running on http://localhost:${port}`)
})