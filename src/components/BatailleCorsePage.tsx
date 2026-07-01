import { useEffect, useMemo, useState } from 'react'

type Player = 'human' | 'computer'
type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

type Card = {
  id: string
  rank: Rank
  suit: Suit
}

type BattleState = {
  center: Card[]
  hands: Record<Player, Card[]>
  activePlayer: Player
  challengeOwner: Player | null
  pendingPenalty: number
  winner: Player | null
  message: string
}

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']

const rankLabel: Record<Rank, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
}

const suitSymbol: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

const playerLabel: Record<Player, string> = {
  human: 'You',
  computer: 'Computer',
}

const createDeck = () => {
  const deck: Card[] = []

  for (const suit of SUITS) {
    for (let rank = 1 as Rank; rank <= 13; rank += 1) {
      deck.push({
        id: `${rank}-${suit}`,
        rank,
        suit,
      })
    }
  }

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const tempCard = deck[index]
    deck[index] = deck[randomIndex]
    deck[randomIndex] = tempCard
  }

  return deck
}

const cloneState = (state: BattleState) => JSON.parse(JSON.stringify(state)) as BattleState

const initialState = (): BattleState => {
  const deck = createDeck()

  return {
    center: [],
    hands: {
      human: deck.slice(0, 26),
      computer: deck.slice(26),
    },
    activePlayer: 'human',
    challengeOwner: null,
    pendingPenalty: 0,
    winner: null,
    message: 'Tap your deck to play one card, then tap the pile to slap it.',
  }
}

const cardText = (card: Card) => `${rankLabel[card.rank]}${suitSymbol[card.suit]}`

const detectSlapReason = (center: Card[]) => {
  if (center.length < 2) {
    return ''
  }

  const topCard = center[center.length - 1]
  const previousCard = center[center.length - 2]

  if (topCard.rank === previousCard.rank) {
    return 'double'
  }

  if (center.length >= 3 && topCard.rank === center[center.length - 3].rank) {
    return 'sandwich'
  }

  if (center[0].rank === topCard.rank) {
    return 'start / end'
  }

  if (center[0].rank + topCard.rank === 10) {
    return 'start / end ten'
  }

  return ''
}

const penaltyFor = (rank: Rank) => {
  if (rank === 11) return 1
  if (rank === 12) return 2
  if (rank === 13) return 3
  if (rank === 1) return 4
  return 0
}

const isFaceCard = (rank: Rank) => rank === 1 || rank >= 11

type Props = {
  onBack: () => void
}

export const BatailleCorsePage = ({ onBack }: Props) => {
  const [state, setState] = useState<BattleState>(() => initialState())

  const slapReason = useMemo(() => detectSlapReason(state.center), [state.center])

  const resetGame = () => {
    setState(initialState())
  }

  const applyWinnerCheck = (nextState: BattleState) => {
    if (!nextState.winner && nextState.hands.human.length === 0) {
      nextState.winner = 'computer'
      nextState.message = 'You are out of cards. Computer wins.'
    }

    if (!nextState.winner && nextState.hands.computer.length === 0) {
      nextState.winner = 'human'
      nextState.message = 'Computer is out of cards. You win.'
    }

    return nextState
  }

  const playCard = (player: Player) => {
    setState((currentState) => {
      if (currentState.winner || currentState.activePlayer !== player) {
        return currentState
      }

      const nextState = cloneState(currentState)
      const card = nextState.hands[player].shift()

      if (!card) {
        nextState.winner = player === 'human' ? 'computer' : 'human'
        nextState.message = `${playerLabel[player]} has no cards left.`
        return nextState
      }

      nextState.center.push(card)

      if (isFaceCard(card.rank)) {
        nextState.challengeOwner = player
        nextState.pendingPenalty = penaltyFor(card.rank)
        nextState.activePlayer = player === 'human' ? 'computer' : 'human'
        nextState.message = `${playerLabel[player]} played ${cardText(card)}. Cover ${nextState.pendingPenalty} card${nextState.pendingPenalty === 1 ? '' : 's'}.`
        return applyWinnerCheck(nextState)
      }

      if (nextState.pendingPenalty > 0) {
        nextState.pendingPenalty -= 1

        if (nextState.pendingPenalty === 0 && nextState.challengeOwner) {
          nextState.hands[nextState.challengeOwner].push(...nextState.center)
          nextState.center = []
          nextState.challengeOwner = null
          nextState.activePlayer = player
          nextState.message = `${playerLabel[player]} completed the challenge.`
          return applyWinnerCheck(nextState)
        }
      }

      nextState.activePlayer = player === 'human' ? 'computer' : 'human'
      nextState.message = `${playerLabel[player]} played ${cardText(card)}${detectSlapReason(nextState.center) ? `. ${detectSlapReason(nextState.center)} is live.` : '.'}`
      return applyWinnerCheck(nextState)
    })
  }

  const slapPile = (player: Player) => {
    setState((currentState) => {
      if (currentState.winner) {
        return currentState
      }

      const nextState = cloneState(currentState)
      const reason = detectSlapReason(nextState.center)

      if (!reason) {
        const wrongCard = nextState.hands[player].shift()

        if (wrongCard) {
          nextState.hands[player === 'human' ? 'computer' : 'human'].push(wrongCard)
        }

        nextState.message = `${playerLabel[player]} slapped too early.`
        nextState.activePlayer = player === 'human' ? 'computer' : 'human'
        return nextState
      }

      nextState.hands[player].push(...nextState.center)
      nextState.center = []
      nextState.challengeOwner = null
      nextState.pendingPenalty = 0
      nextState.activePlayer = player
      nextState.message = `${playerLabel[player]} wins the pile with ${reason}.`
      return applyWinnerCheck(nextState)
    })
  }

  useEffect(() => {
    if (state.winner || state.activePlayer !== 'computer') {
      return
    }

    const timer = window.setTimeout(() => {
      const reason = detectSlapReason(state.center)

      if (reason && Math.random() > 0.45) {
        slapPile('computer')
        return
      }

      playCard('computer')
    }, 850)

    return () => window.clearTimeout(timer)
  }, [state.activePlayer, state.center, state.winner])

  const canHumanPlay = !state.winner && state.activePlayer === 'human'
  const canHumanSlap = !state.winner && Boolean(slapReason)

  return (
    <section className="card battle-shell" aria-label="Bataille Corse game">
      <div className="battle-topbar">
        <div>
          <p className="eyebrow">Bataille Corse</p>
          <h1>Card battle</h1>
          <p className="subtitle">Tap your deck to play one card. Tap the pile to slap when it qualifies.</p>
        </div>
        <div className="battle-actions">
          <button type="button" className="back-button" onClick={onBack}>Back to love app</button>
          <button type="button" className="primary-action" onClick={resetGame}>Restart</button>
        </div>
      </div>

      <div className="battle-status">
        <span>{state.winner ? `${playerLabel[state.winner]} wins` : `${playerLabel[state.activePlayer]} to play`}</span>
        <span>{state.pendingPenalty > 0 ? `Penalty: ${state.pendingPenalty}` : 'No penalty'}</span>
        <span>{slapReason ? `Slap: ${slapReason}` : 'No slap right now'}</span>
      </div>

      <div className="battle-board">
        <button
          type="button"
          className={`battle-deck opponent ${state.activePlayer === 'computer' ? 'active' : ''}`}
          onClick={() => playCard('computer')}
          disabled={state.activePlayer !== 'computer'}
          aria-label="Computer deck"
        >
          <span>Computer</span>
          <strong>{state.hands.computer.length}</strong>
        </button>

        <button
          type="button"
          className={`battle-pile ${canHumanSlap ? 'slappable' : ''}`}
          onClick={() => slapPile('human')}
          aria-label="Slap pile"
        >
          {state.center.length ? (
            <div className="battle-card-face">
              <span>{cardText(state.center[state.center.length - 1])}</span>
              <small>{state.center.length} cards in pile</small>
            </div>
          ) : (
            <span className="empty-pile">Tap here to slap pile</span>
          )}
        </button>

        <button
          type="button"
          className={`battle-deck human ${state.activePlayer === 'human' ? 'active' : ''}`}
          onClick={() => playCard('human')}
          disabled={!canHumanPlay}
          aria-label="Your deck"
        >
          <span>You</span>
          <strong>{state.hands.human.length}</strong>
        </button>
      </div>

      <p className="battle-message">{state.message}</p>
    </section>
  )
}