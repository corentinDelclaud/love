import { type CSSProperties, type RefObject } from 'react'

type Point = {
  x: number
  y: number
}

type InvitePageProps = {
  buttonStageRef: RefObject<HTMLDivElement | null>
  message: string
  noPosition: Point
  onNoMove: () => void
  onYesClick: () => void
}

export const InvitePage = ({
  buttonStageRef,
  noPosition,
  onNoMove,
  onYesClick,
}: InvitePageProps) => (
  <section className="card hero-card" aria-label="invitation de rendez-vous">
    <p className="eyebrow">Pour ma personne préférée😘​💐​</p>
    <h1>Un petit rendez-vous  ?</h1>
    <p className="subtitle">Un bouton dit oui. L'autre est un peu timide.</p>

    <div ref={buttonStageRef} className="button-stage" aria-label="Choisis ta réponse">
      <button type="button" className="yes-button" onClick={onYesClick}>
        OUI 😍​
      </button>

      <button
        type="button"
        className="no-button"
        onMouseEnter={onNoMove}
        onPointerEnter={onNoMove}
        onFocus={onNoMove}
        onClick={onNoMove}
        style={{
          left: `${noPosition.x}px`,
          top: `${noPosition.y}px`,
        } as CSSProperties}
      >
        Non !😨​
      </button>
    </div>
  </section>
)
