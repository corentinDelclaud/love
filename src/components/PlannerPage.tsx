import { ACTIVITY_OPTIONS, type Activity } from '../data/plannerData'

type PlannerPageProps = {
  activity: Activity
  activityChoices: readonly string[]
  choice: string
  date: string
  note: string
  place: string
  summary: string
  time: string
  onActivityChange: (activity: Activity) => void
  onBack: () => void
  onChoiceChange: (choice: string) => void
  onDateChange: (date: string) => void
  onNoteChange: (note: string) => void
  onPlaceChange: (place: string) => void
  onLockPlan: () => void
  onTimeChange: (time: string) => void
}

export const PlannerPage = ({
  activity,
  activityChoices,
  choice,
  date,
  note,
  place,
  summary,
  time,
  onActivityChange,
  onBack,
  onChoiceChange,
  onDateChange,
  onLockPlan,
  onNoteChange,
  onPlaceChange,
  onTimeChange,
}: PlannerPageProps) => (
  <section className="card planner-card" aria-label="date planner">
    <div className="planner-header">
      <div>
        <p className="eyebrow">Date planner</p>
        <h1>Lock the plan.</h1>
        <p className="subtitle">Choose the day, time, activity, and the exact kind of fun.</p>
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

        <label>
          <span>Activity</span>
          <select
            value={activity}
            onChange={(event) => {
              const nextActivity = event.target.value as Activity
              onActivityChange(nextActivity)
            }}
          >
            {Object.keys(ACTIVITY_OPTIONS).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Option</span>
          <select value={choice} onChange={(event) => onChoiceChange(event.target.value)}>
            {activityChoices.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="wide">
          <span>Place</span>
          <input
            value={place}
            onChange={(event) => onPlaceChange(event.target.value)}
            placeholder="Restaurant, park, cinema..."
          />
        </label>

        <label className="wide">
          <span>Note</span>
          <textarea value={note} onChange={(event) => onNoteChange(event.target.value)} rows={4} />
        </label>
      </form>

      <aside className="planner-preview">
        <p className="eyebrow">Preview</p>
        <h2>{summary}</h2>
        <p className="subtitle">{note}</p>
        <div className="preview-badges">
          <span>{activity}</span>
          <span>{choice}</span>
          <span>{place}</span>
        </div>
      </aside>
    </div>

    <button type="button" className="primary-action" onClick={onLockPlan}>
      lock the plan
    </button>
  </section>
)
