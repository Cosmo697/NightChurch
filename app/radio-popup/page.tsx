"use client"

import { useRadio } from "@/context/radio-context"
import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Loader2, Music, Radio, Disc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import "./styles.css"

export default function RadioPopup() {
  const { isPlaying, volume, togglePlay, setVolume, toggleMute, isMuted, metadata, isLoading, isLiveDJ, listenerCount } = useRadio()
  const [imageError, setImageError] = useState(false)

  // Set title when component mounts and adjust window size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Night Church Radio'
      
      // Adjust window size to fit player nicely
      const resizeWindow = () => {
        const idealWidth = 400;
        const idealHeight = 600;
        
        if (window.opener && window.innerWidth !== idealWidth) {
          window.resizeTo(idealWidth, idealHeight);
        }
      };
      
      resizeWindow();
      window.addEventListener('resize', resizeWindow);
      
      return () => {
        window.removeEventListener('resize', resizeWindow);
      };
    }
  }, []);
  
  return (
    <div className="radio-popup-container">
      <div className="w-full h-full overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 flex flex-col">
        {/* Top bar with stats */}
        <div className="flex items-center justify-between p-3 bg-black/70 border-b border-zinc-800">
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
            <span className="text-xs font-medium text-zinc-400">
              <span className="text-zinc-300">{listenerCount}</span> {listenerCount === 1 ? 'listener' : 'listeners'}
            </span>
          </div>
        </div>
        
        {/* Album art */}
        <div className="relative flex-1 w-full">
          {metadata.albumArt && !imageError ? (
            <Image
              src={metadata.albumArt || "/placeholder.svg"}
              alt="Album Art"
              fill
              priority
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <Music className="h-32 w-32 text-zinc-600" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
          
          {/* Track info overlay on album art */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-md line-clamp-2">{metadata.title}</h2>
            <p className="text-lg text-zinc-300 drop-shadow-md line-clamp-2">{metadata.artist}</p>
            {isLiveDJ && metadata.currentSong && (
              <p className="text-md text-emerald-300 drop-shadow-md line-clamp-1 mt-1">
                Now Playing: {metadata.currentSong}
              </p>
            )}
          </div>
        </div>
        
        {/* Controls section */}
        <div className="p-4 bg-black border-t border-zinc-800">
          <div className="text-center mb-4">
            <p className="text-xs text-zinc-100 font-semibold">
              <span className="opacity-70">Show:</span> Night Church Radio
            </p>
          </div>
          
          <div className="flex items-center justify-between gap-4">
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
    </div>
  )
}