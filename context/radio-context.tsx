"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

type TrackMetadata = {
  title: string
  artist: string
  albumArt: string
  show: string
  currentSong?: string  // Add optional current song field for live DJ broadcasts
  listeners?: number    // Add listener count field
}

type RadioContextType = {
  isPlaying: boolean
  volume: number
  togglePlay: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  isMuted: boolean
  metadata: TrackMetadata
  isLoading: boolean
  isLiveDJ: boolean
  listenerCount: number  // Add listener count to context
}

const defaultMetadata: TrackMetadata = {
  title: "Night Church Radio",
  artist: "Live Stream",
  albumArt: "",
  show: "Live Stream",
  listeners: 0,
}

// Create a singleton audio instance that persists across renders
let globalAudio: HTMLAudioElement | null = null

const RadioContext = createContext<RadioContextType | undefined>(undefined)

export function RadioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [metadata, setMetadata] = useState<TrackMetadata>(defaultMetadata)
  const [isLoading, setIsLoading] = useState(false)
  const [isLiveDJ, setIsLiveDJ] = useState(false)
  const [listenerCount, setListenerCount] = useState(0)  // Add state for listener count
  const prevVolumeRef = useRef(volume)
  const isInitializedRef = useRef(false)

  // Initialize audio element once on client side
  useEffect(() => {
    // Only create the audio element once across all instances
    if (typeof window !== "undefined" && !globalAudio) {
      globalAudio = new Audio()
      globalAudio.src = "https://radio.socalnightchurch.com/listen/ncradio/radio.mp3"
      globalAudio.preload = "auto"

      // Add error handling
      globalAudio.addEventListener("error", (e) => {
        console.error("Audio error:", e)
        setIsLoading(false)
        setIsPlaying(false)
      })
    }

    // Set initial volume
    if (globalAudio) {
      globalAudio.volume = volume / 100
    }

    isInitializedRef.current = true

    // Clean up function - don't destroy the audio element, just stop it
    return () => {
      if (globalAudio && isPlaying) {
        // Don't destroy the audio element, just pause it
        globalAudio.pause()
      }
    }
  }, [])

  // Handle volume changes
  useEffect(() => {
    if (globalAudio) {
      globalAudio.volume = volume / 100
    }
  }, [volume])

  // Fetch metadata periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const fetchMetadata = async () => {
      try {
        // Fetch from AzuraCast's Now Playing API endpoint
        const response = await fetch("https://radio.socalnightchurch.com/api/nowplaying/ncradio")

        if (!response.ok) {
          throw new Error("Failed to fetch metadata")
        }

        const data = await response.json()

        // Extract metadata from AzuraCast's response format
        if (data) {
          const currentTrack = data.now_playing || {}
          const station = data.station || {}
          const live = data.live || {}
          
          // Extract listener count
          const listeners = data.listeners?.current || 0
          setListenerCount(listeners)

          // If a DJ is live, show their info
          if (live.is_live) {
            setMetadata({
              title: live.streamer_name || "Live DJ",
              artist: "Live Stream",
              albumArt: live.art || "",
              show: station.name || "Night Church Radio",
              currentSong: currentTrack.song?.title || "Unknown Track",
              listeners
            })
            setIsLiveDJ(true)
          } else {
            // Otherwise show the current song
            setMetadata({
              title: currentTrack.song?.title || "Unknown Track",
              artist: currentTrack.song?.artist || "Unknown Artist",
              albumArt: currentTrack.song?.art || "",
              show: station.name || "Night Church Radio",
              listeners
            })
            setIsLiveDJ(false)
          }
        }
      } catch (error) {
        console.error("Error fetching metadata:", error)
      }
    }

    // Fetch immediately on mount
    fetchMetadata()

    // Always fetch every 10 seconds, regardless of playing state
    // This ensures we have updated listener counts even when paused
    intervalId = setInterval(fetchMetadata, 10000)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [])

  const togglePlay = () => {
    if (!globalAudio) return

    setIsLoading(true)

    if (isPlaying) {
      globalAudio.pause()
      setIsPlaying(false)
      setIsLoading(false)
    } else {
      // Reset the audio source to ensure synchronization
      const currentSrc = globalAudio.src

      // Force reload the audio stream
      globalAudio.src = ""
      globalAudio.load()
      globalAudio.src = currentSrc

      // Play with a small delay to ensure proper loading
      setTimeout(() => {
        if (globalAudio) {
          globalAudio
            .play()
            .then(() => {
              setIsPlaying(true)
              setIsLoading(false)
            })
            .catch((error) => {
              console.error("Error playing audio:", error)
              setIsPlaying(false)
              setIsLoading(false)
            })
        }
      }, 100)
    }
  }

  const toggleMute = () => {
    if (!globalAudio) return

    if (isMuted) {
      setVolumeState(prevVolumeRef.current)
      globalAudio.volume = prevVolumeRef.current / 100
    } else {
      prevVolumeRef.current = volume
      setVolumeState(0)
      globalAudio.volume = 0
    }

    setIsMuted(!isMuted)
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
    setIsMuted(newVolume === 0)

    if (globalAudio) {
      globalAudio.volume = newVolume / 100
    }
  }

  return (
    <RadioContext.Provider
      value={{
        isPlaying,
        volume,
        togglePlay,
        setVolume,
        toggleMute,
        isMuted,
        metadata,
        isLoading,
        isLiveDJ,
        listenerCount,
      }}
    >
      {children}
    </RadioContext.Provider>
  )
}

export function useRadio() {
  const context = useContext(RadioContext)
  if (context === undefined) {
    throw new Error("useRadio must be used within a RadioProvider")
  }
  return context
}
