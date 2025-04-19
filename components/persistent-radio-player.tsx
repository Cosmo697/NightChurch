"use client"

import { useRadio } from "@/context/radio-context"
import { Play, Pause, Volume2, VolumeX, Loader2, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import Image from "next/image"

export default function PersistentRadioPlayer() {
  const { isPlaying, volume, togglePlay, setVolume, toggleMute, isMuted, metadata, isLoading } = useRadio()
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`fixed bottom-0 right-0 z-50 transition-all duration-300 ${isExpanded ? "w-80" : "w-16"}`}>
      <div className="bg-black/90 border border-purple-900/50 neon-border rounded-tl-lg overflow-hidden">
        {/* Mini player always visible */}
        <div className="p-3 flex items-center justify-between">
          <Button
            onClick={togglePlay}
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full text-pink-300 hover:bg-pink-950/50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            size="sm"
            variant="ghost"
            className={`${isExpanded ? "rotate-180" : ""} transition-transform`}
          >
            {isExpanded ? "◀" : "▶"}
          </Button>
        </div>

        {/* Expanded player controls */}
        {isExpanded && (
          <div className="p-3 border-t border-purple-900/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-purple-900/30 flex items-center justify-center">
                {metadata.albumArt && !imageError ? (
                  <Image
                    src={metadata.albumArt || "/placeholder.svg"}
                    alt="Album Art"
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Music className="h-8 w-8 text-purple-400/50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{metadata.title}</p>
                <p className="text-xs text-muted-foreground truncate">{metadata.artist}</p>
                <p className="text-xs text-purple-400 truncate mt-1">{metadata.show}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMute}
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-white"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
