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
  message,
  noPosition,
  onNoMove,
  onYesClick,
}: InvitePageProps) => (
  <section className="card hero-card" aria-label="date invitation">
    <p className="eyebrow">For my favorite person</p>
    <h1>Will you try a date with me?</h1>
    <p className="subtitle">One button says yes. The other is a little shy.</p>

    <div ref={buttonStageRef} className="button-stage" aria-label="Choose your answer">
      <button type="button" className="yes-button" onClick={onYesClick}>
        try a date ?
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
        no!
      </button>
    </div>

    <p className="message" aria-live="polite">
      {message || 'Hover over no! if you dare.'}
    </p>
  </section>
)
