"use client"

import { useRadio } from "@/context/radio-context"
import { Play, Pause, Volume2, VolumeX, Loader2, Music, Radio, Disc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { useState } from "react"

export default function RadioPlayer() {
  const { isPlaying, volume, togglePlay, setVolume, toggleMute, isMuted, metadata, isLoading, isLiveDJ, listenerCount } = useRadio()
  const [imageError, setImageError] = useState(false)

  return (
    <div className="w-full max-w-xl mx-auto overflow-hidden rounded-xl shadow-2xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800">
      {/* Full width album art */}
      <div className="relative w-full aspect-square">
        {metadata.albumArt && !imageError ? (
          <Image
            src={metadata.albumArt || "/placeholder.svg"}
            alt="Album Art"
            fill
            priority
            className="object-cover w-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <Music className="h-32 w-32 text-zinc-600" />
          </div>
        )}
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        
        {/* Centered listener count badge at the very top */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-2">
          <div className="bg-black/70 px-3 py-1 rounded-full flex items-center shadow-md">
            <span className="text-xs font-medium text-zinc-400">
              <span className="text-zinc-300">{listenerCount}</span> {listenerCount === 1 ? 'listener' : 'listeners'}
            </span>
          </div>
        </div>
        
        {/* Now playing indicator and show name */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <div className={`px-3 py-1 rounded-full flex items-center ${isLiveDJ ? 'bg-red-900/80' : 'bg-black/60'}`}>
            <div className={`w-2 h-2 rounded-full ${isPlaying ? (isLiveDJ ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-pulse') : 'bg-zinc-400'} mr-2`}></div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-200 flex items-center">
              {isPlaying ? (
                isLiveDJ ? (
                  <>
                    <Radio className="h-3 w-3 mr-1" /> LIVE DJ
                  </>
                ) : (
                  <>
                    <Disc className="h-3 w-3 mr-1" /> AutoDJ
                  </>
                )
              ) : 'PAUSED'}
            </span>
          </div>
          <div className="bg-black/60 px-3 py-1 rounded-full">
            <span className="text-xs font-medium text-zinc-200">Night Church Radio</span>
          </div>
        </div>
        
        {/* Track info overlay on album art */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-md line-clamp-1">{metadata.title}</h2>
          <p className="text-lg text-zinc-300 drop-shadow-md line-clamp-1">{metadata.artist}</p>
          {isLiveDJ && metadata.currentSong && (
            <p className="text-md text-emerald-300 drop-shadow-md line-clamp-1 mt-1">
              Now Playing: {metadata.currentSong}
            </p>
          )}
        </div>
      </div>
      
      {/* Controls section */}
      <div className="p-4 bg-black border-t border-zinc-800">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Play/pause button */}
          <Button
            onClick={togglePlay}
            size="icon"
            className={`h-14 w-14 rounded-full ${isLiveDJ ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-500 hover:bg-emerald-400'} text-black border-none shadow-lg ${isLiveDJ ? 'shadow-red-900/20' : 'shadow-emerald-900/20'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7 ml-1" />
            )}
          </Button>
          
          {/* Volume controls */}
          <div className="flex-1 flex items-center gap-3 bg-zinc-900 rounded-full px-3 py-2">
            <Button 
              onClick={toggleMute} 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
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
            <span className="text-xs font-medium text-zinc-400 w-9 text-center">{volume}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
