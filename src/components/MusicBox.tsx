import { useEffect, useMemo, useRef, useState } from 'react'
import { playlist } from '../data/playlist'
import './MusicBox.css'

type YouTubePlayer = {
  cueVideoById: (videoId: string) => void
  loadVideoById: (videoId: string) => void
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  destroy: () => void
  getPlayerState: () => number
}

type YouTubePlayerOptions = {
  videoId: string
  width: string | number
  height: string | number
  playerVars?: Record<string, string | number | boolean>
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void
    onStateChange?: (event: { data: number; target: YouTubePlayer }) => void
  }
}

type YouTubeApi = {
  Player: new (element: HTMLElement | string, options: YouTubePlayerOptions) => YouTubePlayer
  PlayerState: {
    UNSTARTED: number
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
  }
}

type WindowWithYouTube = Window & {
  YT?: YouTubeApi
  onYouTubeIframeAPIReady?: () => void
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null

const loadYoutubeApi = () => {
  const youtubeWindow = window as WindowWithYouTube

  if (youtubeWindow.YT?.Player) {
    return Promise.resolve(youtubeWindow.YT)
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
      const previousReadyHandler = youtubeWindow.onYouTubeIframeAPIReady

      youtubeWindow.onYouTubeIframeAPIReady = () => {
        previousReadyHandler?.()

        const api = youtubeWindow.YT
        if (api?.Player) {
          resolve(api)
          return
        }

        reject(new Error('YouTube API not available'))
      }

      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        script.async = true
        script.onerror = () => reject(new Error('Impossible de charger l\'API YouTube'))
        document.head.appendChild(script)
      }
    })
  }

  return youtubeApiPromise
}

export function MusicBox() {
  const playerContainerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const currentIndexRef = useRef(0)
  const isPlayingRef = useRef(false)
  const volumeRef = useRef(70)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const currentTrack = useMemo(() => playlist[currentIndex], [currentIndex])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  const syncTrack = (nextIndex: number, autoplay: boolean) => {
    const normalizedIndex = ((nextIndex % playlist.length) + playlist.length) % playlist.length
    const track = playlist[normalizedIndex]
    const player = playerRef.current

    setCurrentIndex(normalizedIndex)

    if (!player) {
      return
    }

    if (autoplay) {
      player.loadVideoById(track.youtubeId)
      player.setVolume(volumeRef.current)
      if (volumeRef.current === 0) {
        player.mute()
      } else {
        player.unMute()
      }
      player.playVideo()
      return
    }

    player.cueVideoById(track.youtubeId)
  }

  const handlePrevious = () => {
    syncTrack(currentIndexRef.current - 1, isPlayingRef.current)
  }

  const handleNext = () => {
    syncTrack(currentIndexRef.current + 1, isPlayingRef.current)
  }

  const handlePlayPause = () => {
    const player = playerRef.current
    if (!player) {
      return
    }

    if (isPlayingRef.current) {
      player.pauseVideo()
      setIsPlaying(false)
      return
    }

    syncTrack(currentIndexRef.current, true)
  }

  const handleVolumeChange = (nextVolume: number) => {
    setVolume(nextVolume)

    const player = playerRef.current
    if (!player) {
      return
    }

    player.setVolume(nextVolume)
    if (nextVolume === 0) {
      player.mute()
    } else {
      player.unMute()
    }
  }

  const handleTrackChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextIndex = playlist.findIndex((track) => track.id === event.target.value)
    if (nextIndex === -1) {
      return
    }

    syncTrack(nextIndex, isPlayingRef.current)
  }

  useEffect(() => {
    let cancelled = false

    loadYoutubeApi()
      .then((api) => {
        if (cancelled || !playerContainerRef.current) {
          return
        }

        const player = new api.Player(playerContainerRef.current, {
          width: '1',
          height: '1',
          videoId: playlist[0].youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (cancelled) {
                return
              }

              playerRef.current = player
              player.setVolume(volumeRef.current)
              if (volumeRef.current === 0) {
                player.mute()
              } else {
                player.unMute()
              }
              player.cueVideoById(playlist[currentIndexRef.current].youtubeId)
              setIsReady(true)
            },
            onStateChange: (event) => {
              if (cancelled) {
                return
              }

              if (event.data === api.PlayerState.PLAYING) {
                setIsPlaying(true)
                return
              }

              if (event.data === api.PlayerState.PAUSED || event.data === api.PlayerState.CUED) {
                setIsPlaying(false)
                return
              }

              if (event.data === api.PlayerState.ENDED) {
                syncTrack(currentIndexRef.current + 1, true)
              }
            },
          },
        })

        playerRef.current = player
      })
      .catch(() => {
        if (!cancelled) {
          setIsReady(false)
        }
      })

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [])

  return (
    <section className="music-box" aria-label="Music Box">
      <div className="music-box__glass">
        <div className="music-box__header">
          <div>
            <p className="music-box__eyebrow">Now playing</p>
            <h2 className="music-box__title">Music Box</h2>
          </div>
          <span className={`music-box__status ${isPlaying ? 'is-playing' : ''}`}>
            {isReady ? (isPlaying ? 'Playing' : 'Paused') : 'Loading'}
          </span>
        </div>

        <div className="music-box__track">
          <span className="music-box__track-label">Track</span>
          <strong>{currentTrack.title}</strong>
          <small>
            {currentIndex + 1}/{playlist.length}
          </small>
        </div>

        <label className="music-box__select-group">
          <span>Choose a track</span>
          <select value={currentTrack.id} onChange={handleTrackChange} aria-label="Choose a track">
            {playlist.map((track) => (
              <option key={track.id} value={track.id}>
                {track.title}
              </option>
            ))}
          </select>
        </label>

        <div className="music-box__controls" aria-label="Playback controls">
          <button type="button" className="music-box__button music-box__button--ghost" onClick={handlePrevious} disabled={!isReady} aria-label="Previous track">
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" className="music-box__button music-box__button--primary" onClick={handlePlayPause} disabled={!isReady} aria-label={isPlaying ? 'Pause' : 'Play'}>
            <span aria-hidden="true">{isPlaying ? '❚❚' : '▶'}</span>
          </button>
          <button type="button" className="music-box__button music-box__button--ghost" onClick={handleNext} disabled={!isReady} aria-label="Next track">
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <label className="music-box__volume">
          <div>
            <span>Volume</span>
            <strong>{volume}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={volume}
            onChange={(event) => handleVolumeChange(Number(event.target.value))}
            aria-label="Volume"
          />
        </label>
      </div>

      <div ref={playerContainerRef} className="music-box__player" aria-hidden="true" />
    </section>
  )
}
