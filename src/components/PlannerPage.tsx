import { ACTIVITY_OPTIONS, type Activity, type ActivityOption } from '../data/plannerData'
import { CustomSelect } from './CustomSelect'

type PlannerPageProps = {
  activity: Activity
  activityChoices: readonly ActivityOption[]
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
      <CustomSelect
        label="Activité"
        value={activity}
        onChange={(nextActivity) => onActivityChange(nextActivity as Activity)}
        options={Object.keys(ACTIVITY_OPTIONS).map((key) => ({
          value: key,
          label: key,
        }))}
      />

      <CustomSelect
        label="Option"
        value={choice}
        onChange={(selectedName) => {
          const selectedOption = activityChoices.find(opt => opt.name === selectedName)
          onChoiceChange(selectedName)
          onPlaceChange(selectedOption?.defaultPlace || '')
        }}
        options={activityChoices.map((option) => ({
          value: option.name,
          label: option.name,
        }))}
      />

      <label className="wide">
        <span>Lieu</span>
        <input
          value={place}
          onChange={(event) => onPlaceChange(event.target.value)}
          placeholder="Adresse ou nom du lieu"
        />
      </label>
    </form>

    <button type="button" className="primary-action" onClick={onLockPlan}>
      Verrouiller le plan
    </button>
  </section>
)
