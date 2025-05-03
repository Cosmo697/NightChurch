"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePuzzle } from '@/context/puzzle-context'
import Link from 'next/link'

type EasterEggProps = {
  id: string
  trigger: 'click' | 'hover'
  children: React.ReactNode
  hintText?: string
  unlockText?: string
  destination?: string
}

export default function EasterEgg({
  id,
  trigger = 'click',
  children,
  hintText = "You've found something hidden...",
  unlockText = "You've unlocked a secret passage",
  destination = '/hidden/account-creation'
}: EasterEggProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const eggRef = useRef<HTMLDivElement>(null)
  const { canAccessEasterEggs, isLevelUnlocked, solvePuzzle } = usePuzzle()
  
  // Check if this egg was already found in local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const found = localStorage.getItem(`nightchurch-egg-${id}`)
      if (found === 'true') {
        setIsCompleted(true)
      }
    }
  }, [id])
  
  const handleInteraction = () => {
    // Only reveal if user has access to easter eggs (solved portal)
    if (canAccessEasterEggs && !isCompleted) {
      setIsRevealed(true)
    }
  }
  
  const handleComplete = () => {
    // Mark as found in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`nightchurch-egg-${id}`, 'true')
    }
    
    // Mark puzzle as solved in context
    solvePuzzle(id)
    
    setIsCompleted(true)
    
    // Close reveal modal
    setTimeout(() => {
      setIsRevealed(false)
    }, 2000)
  }

  return (
    <>
      <div
        ref={eggRef}
        className={`easter-egg ${isCompleted ? 'found' : ''}`}
        onClick={trigger === 'click' ? handleInteraction : undefined}
        onMouseEnter={trigger === 'hover' ? handleInteraction : undefined}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setIsRevealed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-sm w-full bg-black border border-purple-700 rounded-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mb-4 text-5xl">✨</div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">
                  {isCompleted ? "Secret Already Discovered" : hintText}
                </h3>
                
                {!isCompleted ? (
                  <>
                    <p className="text-gray-300 mb-6">
                      {unlockText}
                    </p>
                    
                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={() => setIsRevealed(false)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md"
                      >
                        Close
                      </button>
                      
                      <button
                        onClick={handleComplete}
                        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md"
                      >
                        <Link href={destination} className="text-white no-underline">
                          Enter
                        </Link>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-6">
                    <button
                      onClick={() => setIsRevealed(false)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .easter-egg {
          cursor: ${canAccessEasterEggs ? 'pointer' : 'default'};
          /* No special styling by default */
        }
        
        .easter-egg.found {
          /* Optional: add a subtle indicator that this egg was found */
          position: relative;
        }
      `}</style>
    </>
  )
}