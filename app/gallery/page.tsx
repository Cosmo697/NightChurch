"use client"

import Image from "next/image"
import { useState, useRef, useCallback, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { DancerFigure } from "@/components/dancing-figures"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react"

export default function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const imageContainerRef = useRef<HTMLDivElement>(null)
  
  // Define gallery images
  const galleryImages = [
    { src: "/images/gallery/desert-gathering.jpeg", alt: "Desert Gathering", caption: "" },
    { src: "/images/gallery/djs-performing.jpeg", alt: "DJs Performing", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_03.webp", alt: "Astral Mirage 03", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_04.webp", alt: "Astral Mirage 04", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_05.webp", alt: "Astral Mirage 05", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_07.webp", alt: "Astral Mirage 07", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_08.webp", alt: "Astral Mirage 08", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_11.webp", alt: "Astral Mirage 11", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_13.webp", alt: "Astral Mirage 13", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_14.webp", alt: "Astral Mirage 14", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_17.webp", alt: "Astral Mirage 17", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_18.webp", alt: "Astral Mirage 18", caption: "" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_21.webp", alt: "Astral Mirage 21", caption: "" },
    { src: "/images/gallery/Gallery_Event_0_01.webp", alt: "Event 01", caption: "" },
    { src: "/images/gallery/Gallery_Mythos_web_01.webp", alt: "Mythos 01", caption: "" },
    { src: "/images/gallery/Gallery_Mythos_web_03.webp", alt: "Mythos 03", caption: "" },
    { src: "/images/gallery/Gallery_Mythos_web_04.webp", alt: "Mythos 04", caption: "" },
    { src: "/images/gallery/Gallery_Mythos_web_05.webp", alt: "Mythos 05", caption: "" },
    { src: "/images/gallery/Gallery_Mythos_web_06.webp", alt: "Mythos 06", caption: "" },
    { src: "/images/gallery/Gallery_Soma_web_01.webp", alt: "Soma 01", caption: "" },
    { src: "/images/gallery/Gallery_Soma_web_02.webp", alt: "Soma 02", caption: "" },
    { src: "/images/gallery/Gallery_Soma_web_03.webp", alt: "Soma 03", caption: "" },
    { src: "/images/gallery/inflatable-castle.jpeg", alt: "Inflatable Castle", caption: "" },
  ]

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      resetZoom()
      setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      resetZoom()
      setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length)
    }
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setPanPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y })
    }
  }, [zoomLevel, panPosition])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      setPanPosition({ x: newX, y: newY })
    }
  }, [isDragging, dragStart, zoomLevel])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
    e.preventDefault()
  }, [handleZoomIn, handleZoomOut])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  // Reset zoom when dialog closes
  useEffect(() => {
    if (selectedImageIndex === null) {
      resetZoom()
      setIsFullscreen(false)
    }
  }, [selectedImageIndex])

  // Add event listeners to document for dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && zoomLevel > 1) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        setPanPosition({ x: newX, y: newY })
      }
    }
    
    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('mousemove', handleGlobalMouseMove)
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [isDragging, dragStart, zoomLevel])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious()
          e.preventDefault()
          break
        case 'ArrowRight':
          handleNext()
          e.preventDefault()
          break
        case '+':
        case '=':
          handleZoomIn()
          e.preventDefault()
          break
        case '-':
          handleZoomOut()
          e.preventDefault()
          break
        case 'Escape':
          if (zoomLevel > 1) {
            resetZoom()
          } else if (isFullscreen) {
            setIsFullscreen(false)
          } else {
            setSelectedImageIndex(null)
          }
          e.preventDefault()
          break
        case 'f':
          toggleFullscreen()
          e.preventDefault()
          break
        case '0':
          resetZoom()
          e.preventDefault()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImageIndex, handleZoomIn, handleZoomOut, isFullscreen, zoomLevel, toggleFullscreen])

  const selectedImage = selectedImageIndex !== null ? galleryImages[selectedImageIndex] : null

  return (
    <div className="container py-12 relative">
      {/* Dancing figure in the top-right corner */}
      <div className="absolute top-0 right-0 z-0">
        <DancerFigure delay={800} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">Gallery</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Explore the visual journey of Night Church events in the Southern California desert
      </p>

      {galleryImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Card 
              key={index} 
              className="overflow-hidden bg-black/50 border border-purple-900/50 group cursor-pointer"
              onClick={() => setSelectedImageIndex(index)}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3 text-sm text-center text-muted-foreground">{image.caption}</div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-black/50 border border-purple-900/50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Gallery Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're curating a collection of images from our events. Check back soon to see the visual journey of Night
            Church.
          </p>
        </div>
      )}

      {/* Image Dialog/Modal with Navigation */}
      <Dialog 
        open={selectedImageIndex !== null} 
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent 
          className={`border-purple-900/50 bg-black/95 p-0 overflow-hidden ${
            isFullscreen ? 'max-w-none w-screen h-screen rounded-none m-0' : 'max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] sm:p-2'
          }`}
        >
          {/* Add DialogTitle for accessibility - visually hidden but available to screen readers */}
          <DialogTitle className="sr-only">
            {selectedImage ? selectedImage.alt || "Gallery image" : "Image viewer"}
          </DialogTitle>
          
          {/* Close button */}
          <DialogClose className="absolute right-4 top-4 z-10 bg-black/50 p-2 rounded-full">
            <X className="h-5 w-5 text-white" />
          </DialogClose>
          
          {/* Fullscreen toggle */}
          <Button 
            onClick={toggleFullscreen} 
            className="absolute right-16 top-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
            size="icon"
            variant="ghost"
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
          
          {/* Image container */}
          <div 
            ref={imageContainerRef}
            className={`relative ${isFullscreen ? 'w-full h-full' : 'aspect-auto w-full h-[70vh]'} overflow-hidden`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: zoomLevel > 1 ? 'grab' : 'default', touchAction: 'none' }}
          >
            {selectedImage && (
              <div 
                className="absolute top-1/2 left-1/2 transition-transform duration-100 ease-out"
                style={{ 
                  transform: `translate(-50%, -50%) translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                  willChange: 'transform'
                }}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt || "Gallery image"}
                  className={`max-w-none max-h-none ${isFullscreen ? 'object-contain w-screen h-screen' : ''}`}
                  style={{ 
                    cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'default')
                  }}
                  draggable="false"
                />
              </div>
            )}
            
            {/* Zoom controls */}
            <div className="absolute left-4 bottom-4 flex space-x-2 z-10">
              <Button 
                onClick={handleZoomOut} 
                disabled={zoomLevel <= 1}
                size="icon" 
                variant="ghost" 
                className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button 
                onClick={resetZoom} 
                disabled={zoomLevel === 1}
                size="icon" 
                variant="ghost" 
                className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <span className="text-xs">100%</span>
              </Button>
              <Button 
                onClick={handleZoomIn} 
                disabled={zoomLevel >= 4}
                size="icon" 
                variant="ghost" 
                className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Zoom level indicator */}
            <div className="absolute right-4 bottom-4 bg-black/50 px-2 py-1 rounded text-sm text-white">
              {Math.round(zoomLevel * 100)}%
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-y-0 left-2 flex items-center">
            <Button 
              onClick={handlePrevious} 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute inset-y-0 right-2 flex items-center">
            <Button 
              onClick={handleNext} 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Caption (if present) */}
          {selectedImage && selectedImage.caption && (
            <div className="p-3 text-center text-white bg-black/60 absolute bottom-0 inset-x-0">
              {selectedImage.caption}
            </div>
          )}
          
          {/* Keyboard shortcuts helper (only visible when no caption) */}
          {(!selectedImage?.caption) && (
            <div className="p-2 text-center text-xs text-gray-400 bg-black/60 absolute bottom-0 inset-x-0">
              Use arrow keys to navigate • Mouse wheel or +/- to zoom • F for fullscreen • ESC to reset/close
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
