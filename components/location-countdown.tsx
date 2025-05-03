"use client"

import { useState, useEffect } from 'react'

interface LocationCountdownProps {
  targetDate: Date
}

export function LocationCountdown({ targetDate }: LocationCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()
      
      if (difference <= 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      
      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [targetDate])
  
  return (
    <div className="grid grid-cols-4 gap-1 text-center">
      <div className="bg-purple-900/30 rounded-md p-1">
        <div className="text-sm font-bold text-white">{timeLeft.days}</div>
        <div className="text-xs text-purple-300">Days</div>
      </div>
      <div className="bg-purple-900/30 rounded-md p-1">
        <div className="text-sm font-bold text-white">{timeLeft.hours}</div>
        <div className="text-xs text-purple-300">Hours</div>
      </div>
      <div className="bg-purple-900/30 rounded-md p-1">
        <div className="text-sm font-bold text-white">{timeLeft.minutes}</div>
        <div className="text-xs text-purple-300">Mins</div>
      </div>
      <div className="bg-purple-900/30 rounded-md p-1">
        <div className="text-sm font-bold text-white">{timeLeft.seconds}</div>
        <div className="text-xs text-purple-300">Secs</div>
      </div>
    </div>
  )
}