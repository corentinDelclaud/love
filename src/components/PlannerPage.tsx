import { ACTIVITY_OPTIONS, type Activity } from '../data/plannerData'

type PlannerPageProps = {
  activity: Activity
  activityChoices: readonly string[]
  choice: string
  place: string
  onActivityChange: (activity: Activity) => void
  onBack: () => void
  onChoiceChange: (choice: string) => void
  onPlaceChange: (place: string) => void
  onLockPlan: () => void
}

export const PlannerPage = ({
  activity,
  activityChoices,
  choice,
  place,
  onActivityChange,
  onBack,
  onChoiceChange,
  onLockPlan,
  onPlaceChange,
}: PlannerPageProps) => (
  <section className="card planner-card" aria-label="planificateur de rendez-vous">
    <div className="planner-header">
      <div>
        <p className="eyebrow">Détails</p>
        <h1>Tu veux faire quoi ?</h1>
        <p className="subtitle">Choisis ce qui te fais plaisir.</p>
      </div>
      <button type="button" className="back-button" onClick={onBack}>
        Retour
      </button>
    </div>

    <form className="planner-form">
      <label>
        <span>Activité</span>
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
        <span>Lieu</span>
        <input
          value={place}
          onChange={(event) => onPlaceChange(event.target.value)}
          placeholder="Restaurant, parc, cinéma..."
        />
      </label>
    </form>

    <button type="button" className="primary-action" onClick={onLockPlan}>
      Verrouiller le plan
    </button>
  </section>
)
