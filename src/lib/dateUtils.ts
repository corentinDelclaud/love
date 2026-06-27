export const getNextFriday = () => {
  const date = new Date()
  const dayIndex = date.getDay()
  const daysUntilFriday = (5 - dayIndex + 7) % 7 || 7
  date.setDate(date.getDate() + daysUntilFriday)
  return date
}

export const formatDateInput = (date: Date) => date.toISOString().slice(0, 10)

export const formatPrettyDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date)
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)

  return `${weekday} ${day} ${month}`
}

export const formatPrettyTime = (value: string) => {
  if (!value.includes(':')) {
    return value
  }

  const [hoursText, minutesText] = value.split(':')
  const hours = Number(hoursText)
  const minutes = Number(minutesText)

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value
  }

  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = ((hours + 11) % 12) + 1
  return `${displayHours}:${minutesText.padStart(2, '0')}${period}`
}

export const buildMailtoUrl = ({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}) => `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
