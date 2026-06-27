export type SendMailPayload = {
  recipient: string
  subject: string
  body: string
}

export type SendMailResponse = {
  message: string
  messageId?: string
}

export const sendMail = async (payload: SendMailPayload) => {
  const response = await fetch('/api/send-mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as SendMailResponse | { error: string }

  if (!response.ok) {
    const errorMessage = 'error' in data ? data.error : 'Unable to send mail'
    throw new Error(errorMessage)
  }

  return data as SendMailResponse
}