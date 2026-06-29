type DateTimePageProps = {
  date: string
  time: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onBack: () => void
  onNext: () => void
}

export const DateTimePage = ({
  date,
  time,
  onDateChange,
  onTimeChange,
  onBack,
  onNext,
}: DateTimePageProps) => (
  <section className="card planner-card" aria-label="sélecteur de date et d'heure">
    <div className="planner-header">
      <div>
        <p className="eyebrow"> Mon cœur est trop plein de toi pour être jamais à un autre ; je t'aime et je t'aimerai jusqu'au dernier jour de ma vie</p>
        <h1>Date & Heure</h1>
        <p className="subtitle">Sélectionnez le jour et l'heure pour votre rendez-vous.</p>
      </div>
      <button type="button" className="back-button" onClick={onBack}>
        Retour
      </button>
    </div>

    <div className="planner-layout">
      <form className="planner-form">
        <label>
          <span>Date 🗓️​</span>
          <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} />
        </label>

        <label>
          <span>Heure ⌚​</span>
          <input type="time" value={time} onChange={(event) => onTimeChange(event.target.value)} />
        </label>
      </form>
    </div>

    <button type="button" className="primary-action" onClick={onNext}>
      Suivant
    </button>
  </section>
)
