"use client"

import { useState, useEffect } from 'react'
import { usePuzzle } from '@/context/puzzle-context'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function HiddenBrain() {
  const [isKeyFound, setIsKeyFound] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const { canAccessEasterEggs, puzzleLevels } = usePuzzle()
  const router = useRouter()
  
  // Check if key was found in local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const found = localStorage.getItem('nightchurch-key-found')
      if (found === 'true') {
        setIsKeyFound(true)
      }
      
      const unlocked = localStorage.getItem('nightchurch-brain-unlocked')
      if (unlocked === 'true') {
        setIsUnlocked(true)
      }
    }
  }, [])
  
  const handleBrainClick = () => {
    if (canAccessEasterEggs && isKeyFound && !isUnlocked) {
      // Set unlocked status
      localStorage.setItem('nightchurch-brain-unlocked', 'true')
      setIsUnlocked(true)
      
      // Play a subtle sound effect if available
      const audio = new Audio('/sounds/brain-unlock.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {
        // Silently fail if audio can't play
      })
      
      // Get the whispers puzzle path
      const whispersPuzzle = puzzleLevels.find(level => level.id === 'whispers')
      
      // Redirect to the whispers puzzle page after a short delay
      setTimeout(() => {
        router.push(whispersPuzzle?.path || '/hidden/whispers-puzzle')
      }, 1500)
    }
  }

  if (!canAccessEasterEggs) return null

  return (
    <motion.div
      className={`fixed cursor-pointer z-10 top-12 left-8 opacity-30 hover:opacity-100 transition-opacity duration-300`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ 
        rotate: isKeyFound ? 15 : 0,
        scale: isKeyFound ? 1.1 : 1
      }}
      onClick={handleBrainClick}
    >
      <div className="text-2xl select-none" title={isUnlocked ? "Brain unlocked!" : isKeyFound ? "Use key here?" : "Locked"}>
        {isUnlocked ? "🧠✨" : "🧠🔒"}
      </div>
      {isKeyFound && !isUnlocked && (
        <span className="absolute top-full left-0 text-xs text-purple-400 whitespace-nowrap">
          Your key might unlock this
        </span>
      )}
      {isUnlocked && (
        <span className="absolute top-full left-0 text-xs text-purple-400 whitespace-nowrap">
          Mind opened
        </span>
      )}
    </motion.div>
  )
}