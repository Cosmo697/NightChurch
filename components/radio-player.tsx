"use client"

import { useRadio } from "@/context/radio-context"
import { Play, Pause, Volume2, VolumeX, Loader2, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"

export default function RadioPlayer() {
  const { isPlaying, volume, togglePlay, setVolume, toggleMute, isMuted, metadata, isLoading } = useRadio()
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="bg-black/70 border border-purple-900/50 neon-border">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-32 rounded-md overflow-hidden mb-4 border border-purple-900/50 flex items-center justify-center">
            {metadata.albumArt && !imageError ? (
              <Image
                src={metadata.albumArt || "/placeholder.svg"}
                alt="Album Art"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Music className="h-16 w-16 text-purple-400/50" />
            )}
          </div>

          <div className="w-full mb-4">
            <h3 className="text-xl font-bold text-center mb-1">{metadata.title}</h3>
            <p className="text-muted-foreground text-center">{metadata.artist}</p>
            <p className="text-sm text-purple-400 text-center mt-1">{metadata.show}</p>
          </div>

          <div className="flex items-center justify-center gap-4 w-full mb-6">
            <Button
              onClick={togglePlay}
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full border-pink-500 text-pink-300 hover:bg-pink-950/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 w-full">
            <Button onClick={toggleMute} size="icon" variant="ghost" className="text-muted-foreground hover:text-white">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
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
      </CardContent>
    </Card>
  )
}
