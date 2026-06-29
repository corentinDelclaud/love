import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

import { InvitePage } from './components/InvitePage'
import { MailPage } from './components/MailPage'
import { PlannerPage } from './components/PlannerPage'
import { DateTimePage } from './components/DateTimePage'
import { ACTIVITY_OPTIONS, type Activity } from './data/plannerData'
import {
  formatDateInput,
  formatPrettyDate,
  formatPrettyTime,
  getNextFriday,
} from './lib/dateUtils'
import { sendMail } from './lib/sendMail'

type Point = {
  x: number
  y: number
}

const BUTTON_SIZE = {
  width: 138,
  height: 54,
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function App() {
  const buttonStageRef = useRef<HTMLDivElement | null>(null)
  const [view, setView] = useState<'invite' | 'datetime' | 'planner' | 'mail'>('invite')
  const [noPosition, setNoPosition] = useState<Point>({ x: 340, y: 120 })
  const [message, setMessage] = useState('')
  const [date, setDate] = useState(() => formatDateInput(getNextFriday()))
  const [time, setTime] = useState('21:00')
  const [activity, setActivity] = useState<Activity>('🍽️ Restaurant')
  const [choice, setChoice] = useState('🍣 Sushi')
  const [place, setPlace] = useState('Centre-ville')
  const [mailMessage, setMailMessage] = useState('J\'ai déjà verrouillé le plan. Il ne reste plus qu\'à envoyer et laisser le rendez-vous commencer.')
  const [recipient, setRecipient] = useState('corentin.delclaud@etu.umontpellier.fr')
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [sendError, setSendError] = useState('')

  const activityChoices = useMemo(() => ACTIVITY_OPTIONS[activity], [activity])

  const summary = useMemo(
    () => `${formatPrettyDate(date)} • ${formatPrettyTime(time)} • ${activity} • ${choice} • ${place}`,
    [activity, choice, date, place, time],
  )

  const mailSubject = useMemo(
    () => `Notre plan de rendez-vous : ${formatPrettyDate(date)} à ${formatPrettyTime(time)}`,
    [date, time],
  )

  const mailBody = useMemo(
    () =>
      [
        `Date : ${formatPrettyDate(date)}`,
        `Heure : ${formatPrettyTime(time)}`,
        `Activité : ${activity}`,
        `Option : ${choice}`,
        `Lieu : ${place}`,
        '',
        mailMessage,
      ].join('\n'),
    [activity, choice, date, mailMessage, place, time],
  )

  useEffect(() => {
    const stage = buttonStageRef.current
    if (!stage) {
      return
    }

    const rect = stage.getBoundingClientRect()
    setNoPosition({
      x: Math.max(20, rect.width - BUTTON_SIZE.width - 20),
      y: Math.max(24, rect.height - BUTTON_SIZE.height - 32),
    })
  }, [])

  const moveNoButton = () => {
    const stage = buttonStageRef.current

    if (!stage) {
      return
    }

    const rect = stage.getBoundingClientRect()
    const padding = 18
    const nextX = padding + Math.random() * (rect.width - BUTTON_SIZE.width - padding * 2)
    const nextY = padding + Math.random() * (rect.height - BUTTON_SIZE.height - padding * 2)

    setNoPosition({
      x: clamp(nextX, padding, rect.width - BUTTON_SIZE.width - padding),
      y: clamp(nextY, padding, rect.height - BUTTON_SIZE.height - padding),
    })
  }

  const handleYesClick = () => {
    setMessage('Nice. Let’s pick the date together.')
    setView('datetime')
  }

  const handleDateTimeNext = () => {
    setView('planner')
  }

  const handlePlannerBack = () => {
    setView('datetime')
  }

  const handleLockPlan = () => {
    setSendStatus('idle')
    setSendError('')
    setView('mail')
  }

  const handleSendMail = async () => {
    setIsSending(true)
    setSendStatus('idle')
    setSendError('')

    try {
      await sendMail({
        recipient,
        subject: mailSubject,
        body: mailBody,
      })
      setSendStatus('success')
    } catch (error) {
      setSendStatus('error')
      setSendError(error instanceof Error ? error.message : 'Impossible d\'envoyer l\'email')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className={`landing ${view !== 'invite' ? 'planner-mode' : ''}`}>
      <div className="soft-glow soft-glow-left" />
      <div className="soft-glow soft-glow-right" />

      {view === 'invite' ? (
        <InvitePage
          buttonStageRef={buttonStageRef}
          message={message}
          noPosition={noPosition}
          onYesClick={handleYesClick}
          onNoMove={moveNoButton}
        />
      ) : view === 'datetime' ? (
        <DateTimePage
          date={date}
          time={time}
          onDateChange={setDate}
          onTimeChange={setTime}
          onBack={() => setView('invite')}
          onNext={handleDateTimeNext}
        />
      ) : view === 'planner' ? (
        <PlannerPage
          activity={activity}
          activityChoices={activityChoices}
          choice={choice}
          place={place}
          onBack={handlePlannerBack}
          onActivityChange={(nextActivity) => {
            setActivity(nextActivity)
            setChoice(ACTIVITY_OPTIONS[nextActivity][0])
          }}
          onChoiceChange={setChoice}
          onPlaceChange={setPlace}
          onLockPlan={handleLockPlan}
        />
      ) : (
        <MailPage
          activity={activity}
          choice={choice}
          date={date}
          mailMessage={mailMessage}
          place={place}
          recipient={recipient}
          summary={summary}
          time={time}
          isSending={isSending}
          sendStatus={sendStatus}
          sendError={sendError}
          onBackToPlanner={() => setView('planner')}
          onSendMail={handleSendMail}
          onRecipientChange={setRecipient}
          onMailMessageChange={setMailMessage}
        />
      )}
    </main>
  )
}

export default App
