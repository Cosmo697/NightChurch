"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type FigureProps = {
  className?: string
  animate?: boolean
  delay?: number
}

export const RockerFigure = ({ className, animate = true, delay = 0 }: FigureProps) => {
  const [isVisible, setIsVisible] = useState(!animate)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [animate, delay])

  return (
    <div
      className={cn(
        "absolute transition-all duration-1000 dancing-figure pointer-events-none",
        animate && "transform hover:scale-105",
        animate && isVisible ? "opacity-70" : "opacity-0",
        className,
      )}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rocker_WEB-rIZcbFVEw44eRiqongjQigdeHt6whf.webp"
        alt="Rocker figure"
        width={200}
        height={400}
        className="w-auto h-auto max-h-[420px] max-w-[300px]"
      />
    </div>
  )
}

export const TrippinFigure = ({ className, animate = true, delay = 0 }: FigureProps) => {
  const [isVisible, setIsVisible] = useState(!animate)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [animate, delay])

  return (
    <div
      className={cn(
        "absolute transition-all duration-1000 dancing-figure pointer-events-none",
        animate && "transform hover:scale-105",
        animate && isVisible ? "opacity-70" : "opacity-0",
        className,
      )}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trippin_WEB-RwfwzKjywoc5r8tXtyrUonoQGPntOY.webp"
        alt="Trippin figure"
        width={200}
        height={400}
        className="w-auto h-auto max-h-[420px] max-w-[300px]"
      />
    </div>
  )
}

export const StarGazingFigure = ({ className, animate = true, delay = 0 }: FigureProps) => {
  const [isVisible, setIsVisible] = useState(!animate)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [animate, delay])

  return (
    <div
      className={cn(
        "absolute transition-all duration-1000 dancing-figure pointer-events-none",
        animate && "transform hover:scale-105",
        animate && isVisible ? "opacity-70" : "opacity-0",
        className,
      )}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/StarGazing_WEB-eONmPRn9tYCkzGxhvQSv1xgqbfElBq.webp"
        alt="Star gazing figures"
        width={420}
        height={210}
        className="w-auto h-auto max-h-[210px] max-w-[420px]"
      />
    </div>
  )
}

export const DancerFigure = ({ className, animate = true, delay = 0 }: FigureProps) => {
  const [isVisible, setIsVisible] = useState(!animate)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [animate, delay])

  return (
    <div
      className={cn(
        "absolute transition-all duration-1000 dancing-figure pointer-events-none",
        animate && "transform hover:scale-105",
        animate && isVisible ? "opacity-70" : "opacity-0",
        className,
      )}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dancer_WEB-78X8NUWVKcGa9QqqW5ziTLtXaCZiox.webp"
        alt="Dancer figure"
        width={200}
        height={400}
        className="w-auto h-auto max-h-[420px] max-w-[300px]"
      />
    </div>
  )
}

export const HeadBangerFigure = ({ className, animate = true, delay = 0 }: FigureProps) => {
  const [isVisible, setIsVisible] = useState(!animate)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [animate, delay])

  return (
    <div
      className={cn(
        "absolute transition-all duration-1000 dancing-figure pointer-events-none",
        animate && "transform hover:scale-105",
        animate && isVisible ? "opacity-70" : "opacity-0",
        className,
      )}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HeadBanger_WEB-AwzlS0mE85yUeAnhBtnJgf7n6DBLfd.webp"
        alt="Head banger figure"
        width={200}
        height={400}
        className="w-auto h-auto max-h-[420px] max-w-[300px]"
      />
    </div>
  )
}

export const StokedFigure = ({ className, animate = true, delay = 0 }: FigureProps) => {
  const [isVisible, setIsVisible] = useState(!animate)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [animate, delay])

  return (
    <div
      className={cn(
        "absolute transition-all duration-1000 dancing-figure pointer-events-none",
        animate && "transform hover:scale-105",
        animate && isVisible ? "opacity-70" : "opacity-0",
        className,
      )}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stoked_WEB-UXrQzrUx2QnKGsiKqXw4avOjNshrEe.webp"
        alt="Stoked figure"
        width={200}
        height={400}
        className="w-auto h-auto max-h-[420px] max-w-[300px]"
      />
    </div>
  )
}

export const InterpretiveFigure = ({ className, animate = true, delay = 0 }: FigureProps) => {
  const [isVisible, setIsVisible] = useState(!animate)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [animate, delay])

  return (
    <div
      className={cn(
        "absolute transition-all duration-1000 dancing-figure pointer-events-none",
        animate && "transform hover:scale-105",
        animate && isVisible ? "opacity-70" : "opacity-0",
        className,
      )}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Interpretive_WEB-CpSojxoKPWOStLXOy0BqY51ExkRJti.webp"
        alt="Interpretive figure"
        width={200}
        height={400}
        className="w-auto h-auto max-h-[420px] max-w-[300px]"
      />
    </div>
  )
}
