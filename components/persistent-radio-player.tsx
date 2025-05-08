"use client"

import { useRadio } from "@/context/radio-context"
import { Play, Pause, Volume2, VolumeX, Loader2, Music, ChevronLeft, ChevronRight, Radio, Disc, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

export default function PersistentRadioPlayer() {
  const { isPlaying, volume, togglePlay, setVolume, toggleMute, isMuted, metadata, isLoading, isLiveDJ, listenerCount } = useRadio()
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isPipMode, setIsPipMode] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Check if Picture-in-Picture is supported
  const isPipSupported = typeof document !== 'undefined' && 
    document.pictureInPictureEnabled && 
    !('documentPictureInPicture' in window) // Exclude old implementation

  // Handle Picture-in-Picture activation
  const togglePictureInPicture = async () => {
    try {
      if (!videoRef.current) return;
      
      if (!document.pictureInPictureElement) {
        // Enter PiP mode
        await videoRef.current.requestPictureInPicture();
        setIsPipMode(true);
      } else {
        // Exit PiP mode
        await document.exitPictureInPicture();
        setIsPipMode(false);
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  }

  const openInNewWindow = () => {
    try {
      // If PiP is supported, use it
      if (isPipSupported && videoRef.current) {
        togglePictureInPicture();
        return;
      }
      
      // Fallback: open in a new popup window with exact dimensions
      const width = 400;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const popup = window.open(
        '/radio-popup', 
        'NightChurchRadio',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
      );
      
      if (!popup || popup.closed) {
        console.error('Popup blocked or failed to open');
      }
    } catch (error) {
      console.error('Error opening player in new window:', error);
    }
  };

  // Handle PiP mode exit
  useEffect(() => {
    const handlePipChange = () => {
      setIsPipMode(!!document.pictureInPictureElement);
    };
    
    if (typeof document !== 'undefined') {
      document.addEventListener('pictureInPicturechange', handlePipChange);
      return () => {
        document.removeEventListener('pictureInPicturechange', handlePipChange);
      };
    }
  }, []);

  // Update canvas with metadata for PiP window
  useEffect(() => {
    if (!isPipMode || !videoRef.current) return;
    
    const updatePipCanvas = () => {
      try {
        const video = videoRef.current;
        if (!video) return;
        
        const canvas = video.querySelector('canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;
        
        // Fill background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw album art if available
        if (metadata.albumArt) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 10, 10, 60, 60);
            drawText(); // Draw text after image loads
          };
          img.onerror = () => {
            drawText(); // Draw text if image fails
          };
          img.src = metadata.albumArt;
        } else {
          drawText();
        }
        
        function drawText() {
          // Draw stream info
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 14px Arial';
          ctx.fillText('Night Church Radio', 80, 25);
          
          ctx.fillStyle = '#aaa';
          ctx.font = '12px Arial';
          
          // Draw current track info
          ctx.fillText(`${metadata.title}`, 80, 45);
          ctx.fillText(`${metadata.artist}`, 80, 65);
          
          // Draw status indicators
          const statusX = 10;
          const statusY = 100;
          
          ctx.fillStyle = isPlaying ? '#4ade80' : '#888';
          ctx.font = '12px Arial';
          ctx.fillText(isPlaying ? 'PLAYING' : 'PAUSED', statusX, statusY);
          
          // Draw DJ status
          ctx.fillStyle = isLiveDJ ? '#f87171' : '#60a5fa';
          ctx.fillText(isLiveDJ ? 'LIVE DJ' : 'AUTO DJ', statusX, statusY + 20);
          
          // Draw listener count
          ctx.fillStyle = '#aaa';
          ctx.fillText(`${listenerCount} ${listenerCount === 1 ? 'listener' : 'listeners'}`, statusX, statusY + 40);
        }
      } catch (error) {
        console.error('Error updating PiP canvas:', error);
      }
    };
    
    // Update PiP display whenever relevant data changes
    updatePipCanvas();
    
    // Return cleanup function
    return () => {};
  }, [isPipMode, metadata, isPlaying, isLiveDJ, listenerCount]);

  return (
    <div className={`fixed bottom-0 right-0 z-50 transition-all duration-300 ${isExpanded ? "w-80" : "w-16"}`}>
      <div className={`bg-black/90 border ${isLiveDJ ? 'border-red-800/50' : 'border-zinc-800'} rounded-tl-lg overflow-hidden shadow-lg ${isLiveDJ ? 'shadow-red-900/30' : 'shadow-purple-900/30'}`}>
        {/* Hidden video element for PiP - uses poster image when available */}
        {isPipSupported && (
          <video 
            ref={videoRef}
            className="hidden"
            autoPlay={isPlaying}
            muted
            playsInline
            poster={metadata.albumArt || '/placeholder.svg'}
            onEnterPictureInPicture={() => setIsPipMode(true)}
            onLeavePictureInPicture={() => setIsPipMode(false)}
          >
            <source src="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAArBtZGF0AAACnAYF//+HXgU2ACwKDFtuVSZ0CgmJ/////////////////////wIAAABkYXZjMQAAABhBTk5JUVZnQlNVR3R3RUFBQUFBMEFBSAIBAA==" type="video/mp4" />
            <canvas className="hidden" width="1" height="1"></canvas>
          </video>
        )}

        {/* Mini player always visible */}
        <div className="p-3 flex items-center justify-between">
          <Button
            onClick={togglePlay}
            size="icon"
            variant="ghost"
            className={`h-10 w-10 rounded-full ${isLiveDJ ? 'text-red-400 hover:bg-red-950/50' : 'text-emerald-400 hover:bg-emerald-950/50'} hover:scale-105 transition-all`}
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
            className="text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            {isExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Expanded player controls */}
        {isExpanded && (
          <div className="p-4 border-t border-zinc-800 bg-gradient-to-br from-black/90 to-zinc-950/30">
            {/* Combined DJ status and listener count */}
            <div className="flex items-center justify-between mb-3">
              {/* DJ status indicator */}
              {isPlaying ? (
                <div className={`px-2 py-1 rounded text-xs font-medium flex items-center ${isLiveDJ ? 'bg-red-900/30 text-red-200' : 'bg-emerald-900/30 text-emerald-200'}`}>
                  {isLiveDJ ? (
                    <>
                      <Radio className="h-3 w-3 mr-1" /> 
                      <span>Live DJ</span>
                    </>
                  ) : (
                    <>
                      <Disc className="h-3 w-3 mr-1" /> 
                      <span>AutoDJ</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="px-2 py-1 rounded text-xs font-medium flex items-center bg-zinc-800/50 text-zinc-300">
                  <span>PAUSED</span>
                </div>
              )}
              
              {/* Listener count badge */}
              <div className="bg-black/70 px-2 py-1 rounded-full flex items-center">
                <span className="text-xs font-medium text-zinc-400">
                  <span className="text-zinc-300">{listenerCount}</span> {listenerCount === 1 ? 'listener' : 'listeners'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col mb-3">
              <div className="relative h-24 w-full aspect-square rounded-md overflow-hidden mb-3 border border-zinc-800 shadow-md flex items-center justify-center group mx-auto">
                {metadata.albumArt && !imageError ? (
                  <Image
                    src={metadata.albumArt || "/placeholder.svg"}
                    alt="Album Art"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <Music className="h-12 w-12 text-zinc-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="bg-black/40 p-2 rounded-md backdrop-blur-sm">
                <p className="text-sm font-medium truncate text-white/90">{metadata.title}</p>
                <p className="text-xs text-zinc-300 truncate">{metadata.artist}</p>
                {isLiveDJ && metadata.currentSong && (
                  <p className="text-xs text-emerald-300 truncate">
                    Now Playing: {metadata.currentSong}
                  </p>
                )}
                <p className="text-xs text-zinc-100 truncate mt-1 font-semibold border-t border-zinc-800/50 pt-1">
                  <span className="opacity-70">Show:</span> Night Church Radio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-md">
              <Button
                onClick={toggleMute}
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-zinc-400 hover:text-white"
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
              <span className="text-xs text-zinc-400 w-6 text-center">{volume}</span>
            </div>
            
            {/* Picture-in-Picture Button */}
            <Button 
              onClick={openInNewWindow}
              size="sm"
              variant="outline"
              className={`w-full mt-4 flex items-center justify-center gap-2 ${
                isPipMode 
                  ? 'bg-purple-900/30 text-purple-300 border-purple-800' 
                  : 'bg-purple-900/30 text-purple-300 border-purple-700 hover:bg-purple-800/30'
              }`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {isPipMode ? 'Exit Pop-out Player' : 'Pop-out Player'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
