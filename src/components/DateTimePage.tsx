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
  <section className="card planner-card" aria-label="date and time picker">
    <div className="planner-header">
      <div>
        <p className="eyebrow">Date & Time</p>
        <h1>Pick when.</h1>
        <p className="subtitle">Choose the day and time for your date.</p>
      </div>
      <button type="button" className="back-button" onClick={onBack}>
        back
      </button>
    </div>

    <div className="planner-layout">
      <form className="planner-form">
        <label>
          <span>Date</span>
          <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} />
        </label>

        <label>
          <span>Hour</span>
          <input type="time" value={time} onChange={(event) => onTimeChange(event.target.value)} />
        </label>
      </form>

      <aside className="planner-preview">
        <p className="eyebrow">Selected</p>
        <h2>{date} at {time}</h2>
      </aside>
    </div>

    <button type="button" className="primary-action" onClick={onNext}>
      next
    </button>
  </section>
)
