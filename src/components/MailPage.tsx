type MailPageProps = {
  activity: string
  choice: string
  date: string
  isSending: boolean
  mailMessage: string
  note: string
  recipient: string
  sendError: string
  sendStatus: 'idle' | 'success' | 'error'
  place: string
  summary: string
  time: string
  onBackToPlanner: () => void
  onMailMessageChange: (message: string) => void
  onSendMail: () => void
  onRecipientChange: (recipient: string) => void
}

export const MailPage = ({
  activity,
  choice,
  date,
  isSending,
  mailMessage,
  note,
  recipient,
  sendError,
  sendStatus,
  place,
  summary,
  time,
  onBackToPlanner,
  onMailMessageChange,
  onSendMail,
  onRecipientChange,
}: MailPageProps) => (
  <section className="card planner-card" aria-label="send date plan by email">
    <div className="planner-header">
      <div>
        <p className="eyebrow">Send mail</p>
        <h1>Send the plan.</h1>
        <p className="subtitle">The email already includes the date, hour, activity, and your custom message.</p>
      </div>
      <button type="button" className="back-button" onClick={onBackToPlanner}>
        back
      </button>
    </div>

    <div className="mail-layout">
      <aside className="planner-preview mail-preview">
        <p className="eyebrow">Mail preview</p>
        <h2>{summary}</h2>
        <div className="preview-badges">
          <span>{date}</span>
          <span>{time}</span>
          <span>{activity}</span>
          <span>{choice}</span>
          <span>{place}</span>
        </div>
        <p className="subtitle">{note}</p>
      </aside>

      <form
        className="planner-form mail-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSendMail()
        }}
      >
        <label className="wide">
          <span>Email address</span>
          <input
            type="email"
            value={recipient}
            onChange={(event) => onRecipientChange(event.target.value)}
            placeholder="corentin.delclaud@etu.umontpellier.fr"
            autoComplete="email"
            required
          />
        </label>

        <label className="wide">
          <span>Custom message</span>
          <textarea
            value={mailMessage}
            onChange={(event) => onMailMessageChange(event.target.value)}
            rows={5}
          />
        </label>

        <button type="submit" className="primary-action mail-link" disabled={isSending}>
          {isSending ? 'sending...' : 'send mail'}
        </button>

        <p className={`mail-status ${sendStatus}`} aria-live="polite">
          {sendStatus === 'success'
            ? `Sent to ${recipient}.`
            : sendStatus === 'error'
              ? sendError || 'Unable to send mail.'
              : 'The API will send the plan directly to that address.'}
        </p>
      </form>
    </div>
  </section>
)
