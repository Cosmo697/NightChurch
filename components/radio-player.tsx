"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [metadata, setMetadata] = useState({ title: "Night Church Radio", artist: "Live Stream" })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevVolumeRef = useRef(volume)

  useEffect(() => {
    audioRef.current = new Audio("https://radio.socalnightchurch.com/listen/ncradio/radio.mp3")

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
      })
    }

    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      setVolume(prevVolumeRef.current)
      audioRef.current.volume = prevVolumeRef.current / 100
    } else {
      prevVolumeRef.current = volume
      setVolume(0)
      audioRef.current.volume = 0
    }

    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  return (
    <Card className="bg-black/70 border border-purple-900/50 neon-border">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="w-full mb-4">
            <h3 className="text-xl font-bold text-center mb-1">{metadata.title}</h3>
            <p className="text-muted-foreground text-center">{metadata.artist}</p>
          </div>

          <div className="flex items-center justify-center gap-4 w-full mb-6">
            <Button
              onClick={togglePlay}
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full border-pink-500 text-pink-300 hover:bg-pink-950/50"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
          </div>

          <div className="flex items-center gap-4 w-full">
            <Button onClick={toggleMute} size="icon" variant="ghost" className="text-muted-foreground hover:text-white">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider value={[volume]} min={0} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
