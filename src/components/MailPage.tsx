type MailPageProps = {
  activity: string
  choice: string
  date: string
  isSending: boolean
  mailMessage: string
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
  <section className="card planner-card" aria-label="envoyer le plan de rendez-vous par email">
    <div className="planner-header">
      <div>
        <h1>Envoye du Mail</h1>
        <p className="subtitle">L'email inclut déjà la date, l'heure, l'activité et votre message personnalisé.</p>
      </div>
      <button type="button" className="back-button" onClick={onBackToPlanner}>
        Retour
      </button>
    </div>

    <div className="mail-layout">
      <aside className="planner-preview mail-preview">
        <p className="eyebrow">Aperçu de l'email</p>
        <h2>{summary}</h2>
        <div className="preview-badges">
          <span>{date}</span>
          <span>{time}</span>
          <span>{activity}</span>
          <span>{choice}</span>
          <span>{place}</span>
        </div>
      </aside>

      <form
        className="planner-form mail-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSendMail()
        }}
      >
        <label className="wide">
          <span>Adresse email</span>
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
          <span>Message personnalisé</span>
          <textarea
            value={mailMessage}
            onChange={(event) => onMailMessageChange(event.target.value)}
            rows={5}
          />
        </label>

        <button type="submit" className="primary-action mail-link" disabled={isSending}>
          {isSending ? 'Envoi en cours...' : 'Envoyer l\'email'}
        </button>

        <p className={`mail-status ${sendStatus}`} aria-live="polite">
          {sendStatus === 'success'
            ? `Envoyé à ${recipient}.`
            : sendStatus === 'error'
              ? sendError || 'Impossible d\'envoyer l\'email.'
              : "L'API va envoyer le plan directement à cette adresse."}
        </p>
      </form>
    </div>
  </section>
)
