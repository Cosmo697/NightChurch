"use client"

import React, { useState } from 'react'
import { usePuzzle } from '@/context/puzzle-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

type WhispersPuzzleProps = {
  onClose: () => void
}

const WhispersPuzzle: React.FC<WhispersPuzzleProps> = ({ onClose }) => {
  const { solvePuzzle, puzzleLevels } = usePuzzle()
  const router = useRouter()
  const [pattern, setPattern] = useState<number[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  
  // Get the current puzzle data
  const puzzleLevel = puzzleLevels.find(level => level.id === 'whispers')
  
  // The correct pattern is 1-3-2-4
  // This represents the rhythm of a heartbeat in the dark
  const correctPattern = [1, 3, 2, 4]
  
  const handleButtonClick = (num: number) => {
    // Add the number to the pattern
    const newPattern = [...pattern, num]
    setPattern(newPattern)
    
    // If we've reached the pattern length, check if it's correct
    if (newPattern.length === correctPattern.length) {
      const match = newPattern.every((val, index) => val === correctPattern[index])
      setIsCorrect(match)
      
      if (match) {
        // Puzzle solved!
        setTimeout(() => {
          solvePuzzle('whispers')
          router.push(puzzleLevel?.path || '/')
        }, 1500)
      } else {
        // Reset after a short delay
        setTimeout(() => {
          setPattern([])
          setIsCorrect(null)
        }, 1000)
      }
    }
  }
  
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-purple-300">Whispers in the Dark</h2>
      
      <p className="text-gray-300">
        In the rhythm of night, a pattern emerges. Follow the heartbeat of the shadows.
      </p>
      
      <div className="grid grid-cols-2 gap-4 my-8">
        {[1, 2, 3, 4].map(num => (
          <Button
            key={num}
            variant="outline"
            className={`h-16 w-full border-purple-700 hover:bg-purple-900/50 text-xl font-bold ${
              pattern.includes(num) ? 'bg-purple-700/30' : ''
            }`}
            onClick={() => handleButtonClick(num)}
            disabled={pattern.length === correctPattern.length}
          >
            {num}
          </Button>
        ))}
      </div>
      
      <div className="flex justify-center space-x-2 mt-4">
        {correctPattern.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              pattern.length > index
                ? isCorrect === false
                  ? 'bg-red-500'
                  : isCorrect === true
                  ? 'bg-green-500'
                  : 'bg-purple-500'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      
      {isCorrect === true && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-400 mt-4"
        >
          The shadows part, revealing a hidden path...
        </motion.div>
      )}
      
      {isCorrect === false && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 mt-4"
        >
          The rhythm falters. Try again.
        </motion.div>
      )}
      
      <div className="flex flex-col items-center mt-6 space-y-2">
        <button
          className="text-xs text-purple-400 hover:text-purple-300"
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? "Hide hint" : "Need a hint?"}
        </button>
        
        {showHint && (
          <p className="text-xs text-pink-300/70 italic">
            Listen to your heart. The rhythm of life follows a natural pattern.
          </p>
        )}
      </div>
      
      <div className="pt-4">
        <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
          Close
        </Button>
      </div>
    </div>
  )
}

export default WhispersPuzzle