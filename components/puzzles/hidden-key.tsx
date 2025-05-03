"use client"

import { useState, useEffect } from 'react'
import { usePuzzle } from '@/context/puzzle-context'
import { motion } from 'framer-motion'

export default function HiddenKey() {
  const [isFound, setIsFound] = useState(false)
  const { canAccessEasterEggs } = usePuzzle()
  
  // Check if key was already found in local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const found = localStorage.getItem('nightchurch-key-found')
      if (found === 'true') {
        setIsFound(true)
      }
    }
  }, [])
  
  const handleKeyFound = () => {
    if (canAccessEasterEggs && !isFound) {
      // Set found status in localStorage
      localStorage.setItem('nightchurch-key-found', 'true')
      
      // Update state
      setIsFound(true)
      
      // Play a subtle sound effect if available
      const audio = new Audio('/sounds/key-found.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {
        // Silently fail if audio can't play
      })
    }
  }

  if (!canAccessEasterEggs) return null

  return (
    <motion.div
      className={`fixed cursor-pointer z-10 bottom-16 right-8 opacity-30 hover:opacity-100 transition-opacity duration-300`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ rotate: 15 }}
      onClick={handleKeyFound}
    >
      <div className="text-2xl select-none" title={isFound ? "Key found!" : "What's this?"}>
        {isFound ? "🔑" : "🗝️"}
      </div>
      {isFound && (
        <span className="absolute top-full left-0 text-xs text-purple-400 whitespace-nowrap">
          Key added to inventory
        </span>
      )}
    </motion.div>
  )
}